"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ws_1 = require("ws");
var config = tslib_1.__importStar(require("../config"));
var DataSender_1 = tslib_1.__importDefault(require("./DataSender"));
var data_generator_1 = require("./data_generator");
var request_promise_1 = tslib_1.__importDefault(require("request-promise"));
function justPrint(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.group(message);
    console.log.apply(console, args);
    console.groupEnd();
}
function createWebSocketServer(types) {
    if (typeof types === 'string') {
        types = JSON.parse(types);
    }
    var webSocketServer = new ws_1.Server({
        host: config.default.web_socket.host,
        port: config.default.web_socket.port
    });
    var dataSender = new DataSender_1.default(data_generator_1.generator(types));
    webSocketServer.on('connection', function (socket, request) {
        console.log("User with ip: " + request.socket.remoteAddress + " was connected.");
        var unsubscribe = dataSender.subscribe(function (data) { return socket.send(data); });
        socket.on('close', unsubscribe);
    });
    webSocketServer.on('listening', function () {
        console.log('listening');
        var _a = config.default.web_socket, host = _a.host, port = _a.port;
        console.log("WebSocketServer has been started at ws://" + host + ":" + port);
    });
    webSocketServer.on('close', justPrint.bind(null, "close"));
    webSocketServer.on('error', justPrint.bind(null, "error"));
}
var timeout = 1000;
function gotcha() {
    console.clear();
    console.log(timeout);
    console.log("Could not connect to web server.");
    setTimeout(main, timeout);
    timeout += 500;
}
function main() {
    request_promise_1.default("http://" + config.default.host + ":" + config.default.port + "/api/metrics")
        .then(createWebSocketServer)
        .catch(gotcha);
}
;
main();
//# sourceMappingURL=emulator.js.map