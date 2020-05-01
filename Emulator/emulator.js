// @ts-check
'use strict';

const { Server: WebSocketServer }    = require('ws');
const { web_socket_port: port }      = require('./config');
const { Observer }                   = require('./Observer');
const { makeRequest }                = require('./db_request');
const { generator }                  = require('./data_generator');

const webSocketServer = new WebSocketServer({
    port 
});

(async () => {
    const { recordsets: [types] } = await makeRequest('select * from MetricsTypes');

    const observer = new Observer(generator(types));

    webSocketServer.on('connection', (socket, req) => {
        console.log(`User with ip: ${req.socket.remoteAddress} was connected.`);
        const unsubscribe = observer.subscribe(
            /**@param {string} data JSON string value*/
            data => socket.send(data)
        );
        socket.on('close', () => unsubscribe());
    });
})();



