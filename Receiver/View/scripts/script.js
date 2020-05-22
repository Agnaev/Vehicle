// @ts-check
'use strict';

import { } from './minifyjs/jquery.min.js';
import ChartCreate from './Chart.js';
import ConnectStatus from './ConnectState.js';
import { } from './minifyjs/notify.min.js';
import { slider, fetch_json, getCookie } from './common.js';
import { } from './Array.prototype.js';

$(document).ready(() => {
    new ConnectStatus($.notify);
    $('#counter').text(0);
});

/** @returns {Promise<{port:number, host:string}>} */
const getWebSocketPort = () => fetch_json('/api/get_socket_connection')
    .then(({ port, host }) => {
        if (port && host) {
            document.cookie = `ws_connection=ws://${host}:${port};max-age=1800;`
            return {
                host,
                port
            };
        }
        else return null;
    });

const charts_list = fetch_json('/api/metrics')
    .then(data =>
        data.map(
            ({ Id, Name, MinValue, MaxValue }) => ({
                Id,
                chart: new ChartCreate(Name, MinValue, MaxValue)
            })
        )
    );

const [ STATES, states, metrics ] = [
    fetch_json('/api/states/list'), 
    fetch_json('/api/states'), 
    fetch_json('/api/metrics')
];

states.then(data => {
    window['indexed_states_by_metricid'] = data
        .reduce((result, item) => {
            return Object.assign({}, result, {
                [item.MetricTypeId]: {
                    ...result[item.MetricTypeId],
                    [item.StateId]: item
                }
            })
        }, {});

    window['norm_metrics'] = Object.values(window['indexed_states_by_metricid'].getCopy())
        .reduce((res, item) => {
            const moved_obj = Object.values(item);
            const max = moved_obj['getMaxByField']('MaxValue');
            const min = moved_obj['getMinByField']('MinValue');
            return {
                ...res,
                [item[1].MetricTypeId]: moved_obj.map(x => ({
                    ...x,
                    MaxValue: (x.MaxValue - min) / ((max - min) || 1),
                    MinValue: (x.MinValue - min) / ((max - min) || 1)
                }))
            };
        }, {});
});

$('#connect_to_vehicle').on('click', async event => {
    event.preventDefault();

    /** @type {{port:number, host:String} | string} */
    let ws_connection = getCookie('ws_connection');
    if (!ws_connection) {
        ws_connection = await getWebSocketPort();
    }

    if (!ws_connection || !Object.keys(ws_connection).length) {
        throw Error('Web socket port was not received.');
    }

    const state = new ConnectStatus($.notify);
    let ws_client;

    if (ws_connection instanceof Object) {
        const { host, port } = ws_connection;
        ws_client = new WebSocket(`ws://${host}:${port}`);
    }
    else {
        ws_client = new WebSocket(ws_connection);
    }

    ws_client.onopen = () => state.connect();
    ws_client.onclose = () => state.disconnect();
    ws_client.onerror = error => {
        $.notify('Произошла ошибка подключения к БПЛА', 'error');
        console.log(`Произошла ошибка с веб сокетом. ${error}`);
    };

    const _metrics = await metrics;
    const _STATES = await STATES;

    ws_client.onmessage = function ({ data }) {
        const parsed_data = JSON.parse(data);
        const find = (Id, value) => window['norm_metrics'][+Id].find(x => x.MinValue <= value && x.MaxValue >= value);

        const normalize_data = Object.entries(parsed_data)
            .reduce((res, item) => {
                const [Id, val] = item;
                const metric = window['indexed_states_by_metricid'][Id];
                return {
                    ...res,
                    [Id]: (val - metric[1].MinValue) / (metric[3].MaxValue - metric[1].MinValue)
                };
            }, {});

        let min = Infinity;
        let j_min = Infinity;
        for (let j = 0; j < 3; j++) {
            let sum = 0;
            for (const item of _metrics) {
                const _state = window['norm_metrics'][item.Id][j];
                sum += Math.pow(normalize_data[item.Id] - (_state.MaxValue + _state.MinValue) / 2, 2);
            }
            if (min > sum) {
                j_min = j;
                min = sum;
            }
        }

        this.common_state.text(_STATES[j_min + 1].Name);

        const current_states = Object.entries(normalize_data)
            .map(item => _STATES[find(...item).StateId]);

        this.charts.forEach(
            ({ chart, Id }, i) => {
                chart.push(this.iterator, parsed_data[Id], current_states[i].color).update();
                chart.changeLabel(current_states[i].Name)
            }
        );
        this.counter.text(this.iterator++);
    }.bind({
        counter: $('#counter'),
        charts: await charts_list,
        iterator: 1,
        common_state: $('#common_state')
    });

    const closeSocket = () => ws_client.close();
    $('#close_connection').one('click', closeSocket);

    window.onunload = closeSocket;

    window['redrawCharts'] = () => {
        if (ws_client.readyState < 2) {
            return new Error('Connection is steel alive!');
        }
        charts_list.then(x =>
            x.forEach(
                chart => chart.chart.removeData()
            )
        );
    }
});

slider();


