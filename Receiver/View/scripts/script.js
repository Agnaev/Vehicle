// @ts-check

import ChartElement from './Chart.js'
import ConnectStatus from './ConnectState.js'
import { } from './jquery.js'

/**@typedef {{Id: number, Name: string, MinValue: number, MaxValue: number, Description: string}} db_item*/
/**@typedef {{chart: ChartElement, Id: Number}} item */

/** 
 * Initialize intial state 
 */
$(document).ready(e => new ConnectStatus());

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
             * @returns {item}
             */
            x => ({
                Id: x.Id,
                chart: new ChartElement(x.Name)
            })
        )
    )

$('#connect_to_vehicle').click(async event => {
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
        charts.map(
            /**@param {item} item*/
            item => item.chart.add_data(iterator++, data[item.Id])
        )
        $('#counter').val(iterator);
    }

    $('#close_connection').click(() => webSocket.close())

    window.onunload = () => webSocket.close();
});

(async () => {
    const images = await fetch_data('/get_images_list');
    let pointer = 0;
    const interval = () => {
        $('#slider').attr('src', '/images/' + images[pointer]);
        pointer = pointer + 1 === images.length ? 0 : pointer + 1;
        setTimeout(interval, 5000);
    }
    interval()
})()