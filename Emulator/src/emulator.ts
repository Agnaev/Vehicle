import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import request from 'request-promise';
import { generator, db_item } from './data_generator';
import DataSender from './DataSender'
import * as config from '../config';

type indexed_type_fn = <T>(arr: Array<T>, field: string) => { [key: string]: T };
const indexing: indexed_type_fn = (arr, field) => {
    return arr.reduce((result, item) => Object.assign(result, {
        [item[field]]: item
    }), {});
};

function createWebSocketServer(types_s: string | Array<db_item>): void {
    const types: Array<db_item> = typeof types_s === 'string' ? JSON.parse(types_s) : types_s;

    const indexed_types = indexing<db_item>(types, 'Id');

    /** @param { string } message */
    const justPrint = (message: string, ...args: Array<any>): void => {
        console.group(message);
        console.log(...args);
        console.groupEnd();
    }
    /** @param { DataSender } dataSender
     * @param { WebSocket } socket
     * @param { IncomingMessage } request
     */
    const connection = (dataSender: DataSender, socket: WebSocket, request: IncomingMessage) => {
        console.log(`User with ip: ${request.socket.remoteAddress} was connected.`);
        const unsubscribe = dataSender.subscribe((data: string) => socket.send(data));
        socket.on('close', unsubscribe);
        socket.on('message', (data: string) => {
            try {
                const parsed_data = JSON.parse(data);
                global['mydata'] = Object.entries(parsed_data).map(([Id, val]) => {
                    const type = indexed_types[Id];
                    if (!type) {
                        return null;
                    }
                    if (+val < +type.MinValue) {
                        val = type.MinValue;
                    }
                    else if (+val > +type.MaxValue) {
                        val = type.MaxValue;
                    }
                    return { Id, val }
                });
            }
            catch (exc) {
                console.log('Incorrect data in request body.');
            }
        })
    };

    const listening = () => {
        console.log('listening');
        const {
            host,
            port
        } = config.default.web_socket;
        console.log(`WebSocketServer has been started at ws://${host}:${port}`);
    }

    const webSocketServer: WebSocket.Server = new WebSocket.Server(config.default.web_socket);
    const dataSender: DataSender = new DataSender(generator(types));

    webSocketServer.on('connection', connection.bind(null, dataSender));
    webSocketServer.on('listening', listening);
    webSocketServer.on('close', justPrint.bind(null, `close`));
    webSocketServer.on('error', justPrint.bind(null, `error`));
}

let timeout = 1000;
(function main() {
    const { host, port } = config.default.server;
    request(`http://${host}:${port}/api/sensors`)
        .then(createWebSocketServer)
        .catch(() => {
            console.clear();
            console.log(`Could not connect to web server.`);
            setTimeout(main, timeout);
            timeout += 1000;
        });
})();

