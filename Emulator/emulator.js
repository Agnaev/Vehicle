// @ts-check
'use strict';

const { Server: WebSocketServer } = require('ws');
const { web_socket_port: port } = require('./config');
const Observer = require('./Observer');
const makeRequest = require('./db_request');
const generator = require('./data_generator');

makeRequest('SELECT * FROM MetricsTypes')
.then(x => x.recordsets[0])
.then(types => {
    const webSocketServer = new WebSocketServer({
        port
    });

    const observer = new Observer(generator(types));
    webSocketServer.on('connection', (socket, request) => {
        console.log(`User with ip: ${request.socket.remoteAddress} was connected.`);
        const unsubscribe = observer.subscribe(
            /**@param {string} data JSON string value*/
            data => socket.send(data)
        );
        socket.on('close', () => unsubscribe());
    });
    webSocketServer.on('listening', (...args) => console.log(`listening ${args.join()}`));
    webSocketServer.on('close', (...args) => console.log(`close ${args.join()}`));
    webSocketServer.on('error', (...args) => console.log(`error ${args.join()}`));
    webSocketServer.on('headers', (...args) => console.log(`headers ${args.join()}`));
});



