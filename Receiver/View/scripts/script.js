// @ts-check
'use strict';

import chartCreate from './Chart.js';
import ConnectStatus from './ConnectState.js';
import { } from './notify.min.js';
import { slider, fetch_json } from './common.js';

document.addEventListener('DOMContentLoaded', function () {
    new ConnectStatus($.notify);
    document.querySelector('#counter').textContent = '0';
});

const getWebSocketPort = fetch_json('/api/get_socket_port')
    .then(x => x.port);

const charts_list = fetch_json('/api/metrics/get')
    .then(data =>
        data.map(
            ({ Id, Name }) => ({
                Id,
                chart: chartCreate(Name)
            })
        )
    );

document.querySelector('#connect_to_vehicle').addEventListener('click', async event => {
    event.preventDefault();
    
    const webSocketPort = await getWebSocketPort;
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

    ws_client.onmessage = function({data}) {
        this.charts.map(
            ({ chart, Id }) => chart.push(this.iterator, JSON.parse(data)[Id]).update()
        );
        this.counter.textContent = (this.iterator++).toString();
    }.bind({
        counter: document.querySelector('#counter'),
        charts,
        iterator: 0
    });

    const closeSocket = () => ws_client.close();
    document.querySelector('#close_connection')
        .addEventListener('click', closeSocket, { 
            once: true 
        });

    window.onunload = closeSocket;
});

slider();


