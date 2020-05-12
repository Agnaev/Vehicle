import { Server as WebSocketServer } from 'ws';
import * as config from '../config';
import DataSender from './DataSender'
import { makeRequest } from './db_request';
import { generator } from './data_generator';

/** @param { string } message */
function justPrint(message: string, ...args: any[]): void {
    console.group(message);
    console.log(...args);
    console.groupEnd();
}

makeRequest('SELECT * FROM MetricsTypes')
    // @ts-ignore
    .then(x => x.recordsets[0])
    .then(types => {

        const webSocketServer = new WebSocketServer({
            port: config.default.web_socket_port
        });

        // @ts-ignore
        const dataSender = new DataSender(generator(types));
        webSocketServer.on('connection', (socket, request) => {
            console.log(`User with ip: ${request.socket.remoteAddress} was connected.`);
            const unsubscribe = dataSender.subscribe(
                /**@param {string} data JSON string value*/
                (data: string) => socket.send(data)
            );
            socket.on('close', unsubscribe);
        });
        webSocketServer.on('listening', justPrint.bind(null, 'listening'));
        webSocketServer.on('close', justPrint.bind(null, `close`));
        webSocketServer.on('error', justPrint.bind(null, `error`));
        webSocketServer.on('headers', justPrint.bind(null, `headers`));
    });


