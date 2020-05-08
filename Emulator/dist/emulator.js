"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ws_1 = require("ws");
var config = tslib_1.__importStar(require("../../config"));
var DataSender_1 = tslib_1.__importDefault(require("./DataSender"));
var db_request_1 = require("./db_request");
var data_generator_1 = require("./data_generator");
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
        socket.on('close', function () { return unsubscribe(); });
    });
    webSocketServer.on('listening', function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.log("listening " + args.join());
    });
    webSocketServer.on('close', function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.log("close " + args.join());
    });
    webSocketServer.on('error', function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.log("error " + args.join());
    });
    webSocketServer.on('headers', function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.log("headers " + args.join());
    });
});
//# sourceMappingURL=emulator.js.map