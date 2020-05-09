import { Server as WebSocketServer } from 'ws';
import * as config from '../config';
import DataSender from './DataSender'
import { makeRequest } from './db_request';
import { generator } from './data_generator';

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
            socket.on('close', () => unsubscribe());
        });
        webSocketServer.on('listening', (...args) => console.log(`listening ${args.join()}`));
        webSocketServer.on('close', (...args) => console.log(`close ${args.join()}`));
        webSocketServer.on('error', (...args) => console.log(`error ${args.join()}`));
        webSocketServer.on('headers', (...args) => console.log(`headers ${args.join()}`));
    });


