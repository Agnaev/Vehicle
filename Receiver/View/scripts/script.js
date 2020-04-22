// @ts-check

import ChartElement from './Chart.js'
import ConnectStatus from './ConnectState.js'

/** 
 * Initialize intial state 
 */
document.addEventListener('DOMContentLoaded', e => new ConnectStatus())

/**
 * @param {string} url Url to api.
 * @param {{[key:string]:string}} options Request options.
 * @param {(Function)} callback Unnecessary callback function which can be called after request with request result.
 * @returns {Promise} Result from server.
 */
const fetch_data = async (url, options = {}, callback = null) => {
    const response = await fetch(url, options).then(x => x.json());
    return callback ? callback(response) : response;
}


const charts = [];
fetch_data('/get_metrics')
.then(data => data.map(x => charts.push(new ChartElement(x.Id, x.Name, 0, x.Value))))

document.querySelector('#connect_to_vehicle').addEventListener('click', async event => {
    let iterator = 1;
    const web_socket_port = await fetch_data('/get_socket_port', {}, x => x.port)
    if(!web_socket_port){
        throw Error('Web socket port was not received')
    }

    const state = new ConnectStatus();
    const webSocket = new WebSocket('ws://localhost:' + web_socket_port);
    
    webSocket.onopen = state.connect;
    webSocket.onclose = state.disconnect;

    webSocket.onmessage = responce => {
        const data = JSON.parse(responce.data);
        console.log('onmessage', data);
        charts.map(chart => {
            const curr_val = data.filter(x => x.Id === chart.Id)[0].value;
            chart.add_data(iterator++, curr_val);
        })
        document.querySelector('#counter').textContent = iterator.toString();
    }

    document.querySelector('#close_connection')
        .addEventListener('click', () => webSocket.close())

    window.onunload = () => webSocket.close();
})




