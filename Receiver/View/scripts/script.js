// @ts-check

import ChartElement from './Chart.js'
import ConnectStatus from './ConnectState.js'

/**@typedef {{Id: number, Name: string, MinValue: number, MaxValue: number, Description: string}} db_item*/

/** 
 * Initialize intial state 
 */
document.addEventListener('DOMContentLoaded', e => new ConnectStatus())

/**
 * @param {string} url Url to api.
 * @param {{[key:string]:string}} options Request options.
 * @returns {Promise} Result from server.
 */
const fetch_data = async (url, options = {}) => 
    await fetch(url, options).then(x => x.json());

const getWebSocketPort = fetch_data('/get_socket_port').then(x => x.port);

const charts_list = fetch_data('/get_metrics')
    .then(data =>  
        data.map(
            /**
             * @param {db_item} x
             */
            x => new ChartElement(x.Id, x.Name)
        )
    )

document.querySelector('#connect_to_vehicle').addEventListener('click', async event => {
    let iterator = 1;
    const webSocketPort = await getWebSocketPort
    if(!webSocketPort){
        throw Error('Web socket port was not received')
    }

    const charts = await charts_list;

    const state = new ConnectStatus();
    const webSocket = new WebSocket('ws://localhost:' + webSocketPort);
    
    webSocket.onopen = () => state.connect();
    webSocket.onclose = () => state.disconnect();

    webSocket.onmessage = responce => {
        const data = JSON.parse(responce.data);
        console.log('onmessage', data);
        charts.map(chart => {
            const curr_val = data.filter(
                /**@param {db_item} x */
                x => x.Id === chart.Id)[0].value;
            chart.add_data(iterator++, curr_val);
        })
        document.querySelector('#counter').textContent = iterator.toString();
    }

    document.querySelector('#close_connection')
        .addEventListener('click', () => webSocket.close())

    window.onunload = () => webSocket.close();
})




