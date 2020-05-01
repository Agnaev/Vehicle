// @ts-check
'use strict'

const { Server: WebSocketServer }    = require('ws');
const { web_socket_port: port }      = require('./config');
const { Observer }                   = require('./Observer');
const { makeRequest }                = require('./db_request')
const { generator }                  = require('./data_generator')

const webSocketServer = new WebSocketServer({
    port
});

(async () => {
    const data_from_db = await makeRequest('select * from MetricsTypes');
    const types = data_from_db.recordsets[0];

    const observer = new Observer(generator(types));

    webSocketServer.on('connection', socket => {
        const unsubscribe = observer.subscribe(
            /**@param {string} data JSON string value*/
            data => socket.send(data)
        );
        socket.on('close', () => unsubscribe());
    });
})();



