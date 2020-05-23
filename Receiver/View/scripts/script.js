// @ts-check
'use strict';

import { } from './minifyjs/jquery.min.js';
import ChartCreate from './Chart.js';
import ConnectStatus from './ConnectState.js';
import { } from './minifyjs/notify.min.js';
import { slider, fetch_json, getCookie } from './common.js';
import { } from './Array.prototype.js';

const statistic = {
    collect_stat: false,
    item: 0,
    count: 100,
    data: []
}
$(document).ready(() => {
    new ConnectStatus($.notify);
    $('#counter').text(0);
    (async () => {
        statistic.collect_stat = await fetch('/collect_stat')
        .then(x => x.json())
        .then(x => x.collect);
        $('#connect_to_vehicle').trigger('click');
    })();
});

/** @returns {Promise<{port:number, host:string}>} */
const getWebSocketPort = () => fetch_json('/api/get_socket_connection')
    .then(({ port, host }) => {
        if (port && host) {
            document.cookie = `ws_connection=ws://${host}:${port};`
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

const [STATES, states, metrics] = [
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

/** @param { Array<number> } data */
const sendStatistics = async data => {
    if (statistic.collect_stat) {
        $.ajax({
            url: '/api/statistic',
            type: 'post',
            data: JSON.stringify(data)
        });
        const cook = getCookie('ws_connection')
        const socket = new WebSocket(cook);
        setTimeout(function interval() {
            if([2, 3].includes(socket.readyState)) {
                throw new Error('closing connection')
            }
            else if(0 === socket.readyState) {
                setTimeout(interval, 100);
            }
            else {
                socket.send('reboot');
                $('#close_connection').trigger('click');
                window.location.reload();
            }
        }, 100);
    }
}

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

    const find = (Id, value) => window['norm_metrics'][+Id].find(x => x.MinValue <= value && x.MaxValue >= value).StateId;

    ws_client.onmessage = function ({ data }) {
        const start = Date.now();
        const parsed_data = JSON.parse(data);

        const normalize_data = Object.entries(parsed_data)
            .reduce((res, [Id, val]) => {
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

        const current_states = Object.entries(normalize_data)
            .map(item => _STATES[find(...item)]);

        this.charts.forEach(
            ({ chart, Id }, i) => {
                chart.push(this.iterator, parsed_data[Id], current_states[i].color).update();
                chart.changeLabel(current_states[i].Name)
            }
        );

        this.common_state.text(_STATES[j_min + 1].Name);
        this.counter.text(this.iterator++);

        if (statistic.collect_stat) {
            statistic.data.push(Date.now() - start);
            statistic.item += 1;
            if (statistic.item >= statistic.count) {
                sendStatistics(statistic.data);
                statistic.item = 0;
            }
        }
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


