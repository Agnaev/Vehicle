import { Server as WebSocketServer } from 'ws';
import * as config from '../config';
import DataSender from './DataSender'
import { generator, db_item } from './data_generator';
import request from 'request-promise'

/** @param { string } message */
function justPrint(message: string, ...args: Array<any>): void {
    console.group(message);
    console.log(...args);
    console.groupEnd();
}

function createWebSocketServer(types_s: string | Array<any>): void {
    const types: Array<db_item> = typeof types_s === 'string' ? JSON.parse(types_s) : types_s;

    const indexed_types = types.reduce(
        (result: { [key: number]: db_item }, item: db_item) => ({ [item.Id]: item, ...result }), {}
    );

    const webSocketServer = new WebSocketServer(config.default.web_socket);

    const dataSender = new DataSender(generator(types));
    webSocketServer.on('connection', (socket, request) => {
        console.log(`User with ip: ${request.socket.remoteAddress} was connected.`);
        const unsubscribe = dataSender.subscribe((data: string) => socket.send(data));
        socket.on('close', unsubscribe);
        socket.on('message', (data: string) => {
            if(data === 'reboot') {
                socket.send('ok');
                webSocketServer.close();
                main();
            }
            try {
                const parsed_data = JSON.parse(data);

                global['mydata'] = Object.entries(parsed_data)
                    .map(([Id, val]) => {
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
                        return {
                            Id,
                            val
                        }
                    });
            }
            catch (exc) {
                console.log('Incorrect data in request body.');
            }

        })
    });
    webSocketServer.on('listening', () => {
        console.log('listening');
        const {
            host,
            port
        } = config.default.web_socket;
        console.log(`WebSocketServer has been started at ws://${host}:${port}`);
    });
    webSocketServer.on('close', justPrint.bind(null, `close`));
    webSocketServer.on('error', justPrint.bind(null, `error`));
}

let timeout = 1000;

function gotcha() {
    console.clear();
    console.log(`Could not connect to web server.`);
    setTimeout(main, timeout);
    timeout += 500
}

function main() {
    const { host, port } = config.default;
    request(`http://${host}:${port}/api/metrics`)
        .then(createWebSocketServer)
        .catch(gotcha);
};
main();

