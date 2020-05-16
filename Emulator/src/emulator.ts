import { Server as WebSocketServer } from 'ws';
import * as config from '../config';
import DataSender from './DataSender'
import { generator } from './data_generator';
import request from 'request-promise'

/** @param { string } message */
function justPrint(message: string, ...args: any[]): void {
    console.group(message);
    console.log(...args);
    console.groupEnd();
}

function createWebSocketServer(types: string | Array<any>): void {
    if (typeof types === 'string') {
        types = JSON.parse(types);
    }

    const webSocketServer = new WebSocketServer({
        host: config.default.web_socket.host,
        port: config.default.web_socket.port
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
    webSocketServer.on('listening', () => {
        console.log('listening');
        const {
            web_socket: {
                host, 
                port
            }
        } = config.default;
        console.log(`WebSocketServer has been started at ws://${host}:${port}`);
    });
    webSocketServer.on('close', justPrint.bind(null, `close`));
    webSocketServer.on('error', justPrint.bind(null, `error`));
    // webSocketServer.on('headers', justPrint.bind(null, `headers`));
}

let timeout = 1000;

function gotcha() {
    console.clear();
    console.log(timeout);
    console.log(`Could not connect to web server.`);
    setTimeout(main, timeout);
    timeout += 500
}

function main() {
    request(`http://${config.default.host}:${config.default.port}/api/metrics`)
        .then(createWebSocketServer)
        .catch(gotcha);
};
main();

