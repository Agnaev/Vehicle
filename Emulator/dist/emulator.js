"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ws_1 = require("ws");
var config = tslib_1.__importStar(require("../config"));
var DataSender_1 = tslib_1.__importDefault(require("./DataSender"));
var db_request_1 = require("./db_request");
var data_generator_1 = require("./data_generator");
function justPrint(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.group(message);
    console.log.apply(console, args);
    console.groupEnd();
}
db_request_1.makeRequest('SELECT * FROM MetricsTypes')
    .then(function (x) { return x.recordsets[0]; })
    .then(function (types) {
    var webSocketServer = new ws_1.Server({
        port: config.default.web_socket_port
    });
    var dataSender = new DataSender_1.default(data_generator_1.generator(types));
    webSocketServer.on('connection', function (socket, request) {
        console.log("User with ip: " + request.socket.remoteAddress + " was connected.");
        var unsubscribe = dataSender.subscribe(function (data) { return socket.send(data); });
        socket.on('close', unsubscribe);
    });
    webSocketServer.on('listening', justPrint.bind(null, 'listening'));
    webSocketServer.on('close', justPrint.bind(null, "close"));
    webSocketServer.on('error', justPrint.bind(null, "error"));
    webSocketServer.on('headers', justPrint.bind(null, "headers"));
});
//# sourceMappingURL=emulator.js.map