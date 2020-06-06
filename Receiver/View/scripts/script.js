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

const createWebSocket = (ws_connection) => {
    if (ws_connection instanceof Object) {
        const { host, port } = ws_connection;
        return new WebSocket(`ws://${host}:${port}`);
    }
    else {
        return new WebSocket(ws_connection);
    }
}

const [STATES, states, metrics] = [
    fetch_json('/api/states/list'),
    fetch_json('/api/states'),
    fetch_json('/api/metrics')
];

$('#connect_to_vehicle').on('click', openConnectionBtnHandler);

async function openConnectionBtnHandler(event) {
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
    const ws_client = createWebSocket(ws_connection);

    ws_client.onopen = () => state.connect();
    ws_client.onclose = () => state.disconnect();
    ws_client.onerror = error => {
        $.notify('Произошла ошибка подключения к БПЛА', 'error');
        console.log(`Произошла ошибка с веб сокетом. ${error}`);
    };

    const [_metrics, _STATES, _states] = await Promise.all([metrics, STATES, states]);

    const indexed_states_by_metricid = _states.reduce((result, item) => Object.assign(result, {
        [item.MetricTypeId]: {
            ...result[item.MetricTypeId],
            [item.StateId]: item
        }
    }), {});

    const norm_metrics = Object.values(indexed_states_by_metricid.getCopy)
        .reduce((res, item) => {
            const moved_item = Object.values(item);
            const max = moved_item['getMaxByField']('MaxValue');
            const min = moved_item['getMinByField']('MinValue');
            return Object.assign(res, {
                [item[1].MetricTypeId]: moved_item.map(x => Object.assign(x, {
                    MaxValue: (x.MaxValue - min) / ((max - min) || 1),
                    MinValue: (x.MinValue - min) / ((max - min) || 1)
                }))
            });
        }, {});

    ws_client.onmessage = function ({ data }) {
        const parsed_data = JSON.parse(data);

        const normalize_data = Object.entries(parsed_data)
            .reduce((res, [Id, val]) => {
                const metric = indexed_states_by_metricid[Id];
                return Object.assign(res, {
                    [Id]: (val - metric[1].MinValue) / (metric[3].MaxValue - metric[1].MinValue)
                });
            }, {});

        const getCurrentStateId = Id => norm_metrics[+Id].find(
            x => x.MinValue <= normalize_data[Id] && x.MaxValue >= normalize_data[Id]
        )?.StateId;

        let min = Infinity;
        let j_min = Infinity;
        for (let j = 0; j < 3; j++) {
            let sum = 0;
            for (const { Id } of _metrics) {
                const _state = norm_metrics[Id][j];
                sum += Math.pow(normalize_data[Id] - (_state.MaxValue + _state.MinValue) / 2, 2);
            }
            if (min > sum) {
                j_min = j;
                min = sum;
            }
        }

        this.common_state.text(_STATES[j_min + 1].Name);

        for(const { Id, chart } of this.charts) {
            const { Name, color } = _STATES[getCurrentStateId(Id)];
            chart.push(this.iterator, parsed_data[Id], color).update().changeLabel(Name);
        }

        this.counter.text(this.iterator++);
    }.bind({
        counter: $('#counter'),
        charts: await charts_list,
        iterator: 1,
        common_state: $('#common_state')
    });

    const closeSocket = () => ws_client.close();
    window.onunload = closeSocket;
    $('#close_connection').one('click', closeSocket);

    window['redrawCharts'] = () => {
        if (ws_client.readyState < 2) {
            return new Error('Connection is steel alive!');
        }
        charts_list.then(x => x.forEach(chart => chart.chart.removeData()));
    }
};

slider();


