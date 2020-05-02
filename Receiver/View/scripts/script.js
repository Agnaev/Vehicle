// @ts-check
'use strict';

import ChartElement from './Chart.js';
import ConnectStatus from './ConnectState.js';

/** Initialize intial state */
document.addEventListener('DOMContentLoaded', e => {
    new ConnectStatus();
    document.querySelector('#counter').textContent = '0';
});

/**
 * @param {string} url Url to api.
 * @param {{[key:string]:string}} options Request options.
 * @returns {Promise<any>} Result from server.
 */
const fetch_data = (url, options = {}) => fetch(url, options).then(x => x.json());

const getWebSocketPort = fetch_data('/api/get_socket_port').then(x => x.port);

const charts_list = fetch_data('/api/metrics/get')
    .then(data =>
        data.map(
            ({ Id, Name }) => ({
                Id,
                chart: new ChartElement(Name)
            })
        )
    );

document.querySelector('#connect_to_vehicle').addEventListener('click', async event => {
    let iterator = 1;
    const webSocketPort = await getWebSocketPort;
    if (!webSocketPort) {
        throw Error('Web socket port was not received.');
    }

    const charts = await charts_list;

    const state = new ConnectStatus();
    const webSocket = new WebSocket('ws://localhost:' + webSocketPort);

    webSocket.onopen = () => state.connect();
    webSocket.onclose = () => state.disconnect();
    webSocket.onerror = error => console.log(`Произошла ошибка с веб сокетом. ${error}`);

    webSocket.onmessage = responce => {
        const data = JSON.parse(responce.data);
        charts.map(
            ({ chart, Id }) => chart.add_data(iterator, data[Id])
        );
        document.querySelector('#counter').textContent = iterator.toString();
        ++iterator;
    }

    const closeSocket = e => webSocket.close();
    document.querySelector('#close_connection')
        .addEventListener('click', closeSocket, { once: true });

    window.onunload = closeSocket;
});

(async () => {
    const images = await fetch_data('/api/get_images_list');
    let pointer = 0;
    (function interval() {
        this.slider.setAttribute('src', '/images/' + this.images[this.pointer]);
        this.pointer = this.pointer + 1 === this.images.length ? 0 : this.pointer + 1;
        setTimeout(interval.bind(this), 5000);
    }).call({ 
        pointer, 
        images, 
        slider: document.querySelector('#slider') 
    });
})();


