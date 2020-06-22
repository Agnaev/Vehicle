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
const getWebSocketConnection = () => fetch_json('/api/get_socket_connection')
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

const createWebSocket = (ws_connection) => {
    if (ws_connection instanceof Object) {
        const { host, port } = ws_connection;
        return new WebSocket(`ws://${host}:${port}`);
    }
    else {
        return new WebSocket(ws_connection);
    }
}

const [STATES, states, sensors] = [
    fetch_json('/api/states/list'),
    fetch_json('/api/states'),
    fetch_json('/api/sensors')
];

const charts_list = sensors.then(data => {
    const result = [];
    for (const { Id, Name, MinValue: min, MaxValue: max } of data) {
        result.push({
            Id,
            chart: new ChartCreate(Name, min, max)
        })
    }
    return result;
});

$('#connect_to_vehicle').on('click', openConnectionBtnHandler);

/**
 * Функция для обработки нажатия на кнопку для открытия соединения с БПЛА 
 * @param {Event} e Событие нажатия на кнопку
 */
async function openConnectionBtnHandler(e) {
    e.preventDefault();

    /** @type {{port:number, host:String} | string} */
    const ws_connection = getCookie('ws_connection') || await getWebSocketConnection();

    if (!ws_connection || !Object.keys(ws_connection).length) {
        throw Error('Web socket host and port was not received.');
    }

    const [_sensors, _STATES, _states] = await Promise.all([sensors, STATES, states]);

    const centers = {};
    for (const { SensorTypeId, StateId, MinValue, MaxValue } of _states) {
        Object.assign(centers, {
            [SensorTypeId]: Object.assign({}, centers[SensorTypeId], {
                [StateId]: {
                    StateId,
                    center: (MinValue + MaxValue) / 2
                }
            })
        })
    }

    const norm_centers = {};
    const indexed_sensors = {};
    for (const { Id, MinValue, MaxValue } of _sensors) {
        Object.assign(norm_centers, {
            [Id]: (() => {
                const result = {};
                for (const { StateId, center } of Object.values(centers[Id])) {
                    Object.assign(result, {
                        [StateId]: (center - MinValue) /
                        //-----------------------------
                        (MaxValue - MinValue)
                    })
                }
                return result;
            })()
        })
        Object.assign(indexed_sensors, {
            [Id]: {
                MinValue,
                MaxValue
            }
        })
    }

    const state = new ConnectStatus($.notify);
    const ws_client = createWebSocket(ws_connection);

    ws_client.onopen = () => state.connect();
    ws_client.onclose = () => state.disconnect();
    ws_client.onerror = error => {
        $.notify('Произошла ошибка подключения к БПЛА', 'error');
        console.log(`Произошла ошибка с веб сокетом. ${error}`);
    };

    function getCurrentStateId(Id, val) {
        return Object.values(centers[Id]).reduce((res, item) => {
            return res?.center && res.center < item.center - val ? res : item
        }, {}).StateId
    }

    ws_client.onmessage = function ({ data }) {
        const parsed_data = JSON.parse(data);

        const normalize_data = {};
        for (const [Id, val] of Object.entries(parsed_data)) {
            const {
                MinValue,
                MaxValue
            } = indexed_sensors[Id];
            Object.assign(normalize_data, {
                [Id]: (val - MinValue) /
                //--------------------------------
                (MaxValue - MinValue)
            });
        }

        let min = Infinity;
        let j_min = Infinity;
        for (let j = 1; j <= 3; j++) {
            let sum = 0;
            for (const { Id } of _sensors) {
                sum += Math.pow(normalize_data[Id] - norm_centers[Id][j], 2);
            }
            if (min > sum) {
                j_min = j;
                min = sum;
            }
        }

        this.common_state.text(_STATES[j_min].Name);

        for (const { Id, chart } of this.charts) {
            const { Name, color } = _STATES[getCurrentStateId(Id, parsed_data[Id])];
            chart.push(this.iterator, parsed_data[Id]).changeLabel(Name).changeColor(color).update();
        }

        this.counter.text(this.iterator++);
    }.bind({
        iterator: 1,
        charts: await charts_list,
        counter: $('#counter'),
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


