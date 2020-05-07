// @ts-check
'use strict';

import chartCreate from './Chart.js';
import ConnectStatus from './ConnectState.js';

Array.prototype['shuffle'] = function () {
    return this.reduce((total, v) => {
        const j = Math.floor(Math.random() * total.length);
        [v, total[j]] = [total[j], v];
        return total;
    }, [...this]);
}

/** Initialize intial state */
document.addEventListener('DOMContentLoaded', function () {
    ['contextmenu', 'selectstart', 'copy', 'select', 'dragstart', 'beforecopy']
        .forEach(
            event => document.body.addEventListener(event, e => e.preventDefault())
        );
    new ConnectStatus();
    document.querySelector('#counter').textContent = '0';
});

/**
 * @param {string} url Url to api.
 * @param {{[key:string]:string}} options Request options.
 * @returns {Promise<any>} Result from server.
 */
const fetch_json = (url, options = {}) => fetch(url, options).then(x => x.json());
const getWebSocketPort = fetch_json('/api/get_socket_port').then(x => x.port);
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

    const charts = await charts_list;

    const state = new ConnectStatus();
    const webSocket = new WebSocket(`ws${location.protocol.includes('s') && 's' || ''}://${location.hostname}:${webSocketPort}`);

    webSocket.onopen = () => state.connect();
    webSocket.onclose = () => state.disconnect();
    webSocket.onerror = error => console.log(`Произошла ошибка с веб сокетом. ${error}`);
    webSocket.onmessage = function({data}) {
        this.charts.map(
            ({ chart, Id }) => chart.push(this.iterator, JSON.parse(data)[Id]).update()
        );
        this.counter.textContent = (this.iterator++).toString();
    }.bind({
        counter: document.querySelector('#counter'),
        charts,
        iterator: 0
    });

    const closeSocket = () => webSocket.close();
    document.querySelector('#close_connection')
        .addEventListener('click', closeSocket, { once: true });

    window.onunload = closeSocket;
});

fetch_json('/api/get_images_list')
    .then(images => {
        (function interval() {
            this.slider.setAttribute('src', '/images/' + this.images[this.pointer]);
            this.pointer = this.pointer + 1 !== this.images.length && this.pointer + 1 || 0;
            setTimeout(interval.bind(this), 5000);
        }).call({
            pointer: 0,
            images: images.shuffle(),
            slider: document.querySelector('#slider')
        });
    });


