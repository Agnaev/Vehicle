// @ts-check
'use strict';

import { } from './jquery.min.js';
import ChartCreate from './Chart.js';
import ConnectStatus from './ConnectState.js';
import { } from './notify.min.js';
import { slider, fetch_json, getCookie } from './common.js';

$(document).ready(() => {
    new ConnectStatus($.notify);
    $('#counter').text(0);
});

const getWebSocketPort = () => fetch_json('/api/get_socket_port')
    .then(x => {
        document.cookie = `ws_port=${x.port};max-age=1800;`
        return x.port;
    });

const charts_list = fetch_json('/api/metrics')
    .then(data =>
        data.map(
            ({ Id, Name }) => ({
                Id,
                chart: new ChartCreate(Name)
            })
        )
    );

$('#connect_to_vehicle').on('click', async event => {
    event.preventDefault();

    let webSocketPort = getCookie('ws_port');
    if (!webSocketPort) {
        webSocketPort = await getWebSocketPort();
    }

    if (!webSocketPort) {
        throw Error('Web socket port was not received.');
    }

    const state = new ConnectStatus($.notify);
    const ws_client = new WebSocket(`ws${location.protocol.includes('s') ? 's' : ''}://${location.hostname}:${webSocketPort}`);

    ws_client.onopen = () => state.connect();
    ws_client.onclose = () => state.disconnect();
    ws_client.onerror = error => {
        $.notify('Произошла ошибка подключения к БПЛА', 'error');
        console.log(`Произошла ошибка с веб сокетом. ${error}`);
    };

    const charts = await charts_list;

    ws_client.onmessage = function ({ data }) {
        this.charts.map(
            ({ chart, Id }) => chart.push(this.iterator, JSON.parse(data)[Id]).update()
        );
        this.counter.text(this.iterator++);
    }.bind({
        counter: $('#counter'),
        charts,
        iterator: 1
    });

    const closeSocket = () => ws_client.close();
    $('#close_connection').one('click', closeSocket);

    window.onunload = closeSocket;

    window['redrawCharts'] = () => {
        if (ws_client.readyState < 2) {
            return new Error('Connection is steel alive!');
        }
        charts.forEach(
            chart => chart.chart.removeData()
        );
    }
});

slider();


