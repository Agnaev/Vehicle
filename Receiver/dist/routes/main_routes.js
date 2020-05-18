"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = require("express");
var fs_1 = tslib_1.__importDefault(require("fs"));
var path_1 = tslib_1.__importDefault(require("path"));
var config_1 = tslib_1.__importDefault(require("../config"));
var logger = config_1.default.logger, basedir = config_1.default.basedir, web_socket = config_1.default.web_socket, error_handler_404 = config_1.default.error_handler_404;
var router = express_1.Router();
router.get('/', function (req, res) {
    try {
        var fileName = path_1.default.join(basedir, 'View', 'Index.html');
        res.sendFile(fileName);
    }
    catch (exc) {
        logger("Error processing request '/'.\r\nfilename: " + __dirname, exc);
        error_handler_404(res, exc);
    }
});
router.get('/values', function (req, res) {
    try {
        var filename = path_1.default.join(basedir, 'View', 'MetricsValues.html');
        res.sendFile(filename);
    }
    catch (exc) {
        logger("Error while getting metrics values from database. filename: " + __dirname + ".\r\nError" + exc);
        res.sendStatus(500);
    }
});
router.get('/metrics', function (req, res) {
    try {
        var fileName = path_1.default.join(basedir, 'View', 'Metrics.html');
        res.sendFile(fileName);
    }
    catch (exc) {
        logger("Error processing request '/metrics'.\r\nfilename: " + __dirname, exc);
        error_handler_404(res, exc);
    }
});
router.get('/states', function (req, res) {
    try {
        var filename = path_1.default.join(basedir, 'View', 'States.html');
        res.sendFile(filename);
    }
    catch (exc) {
        logger("Error processing request '/states'.\r\nfilename: " + __dirname, exc);
        error_handler_404(res, exc);
    }
});
router.get('/api/get_socket_connection', function (req, res) {
    res.send(web_socket);
});
router.get('/api/get_images_list', function (req, res) {
    try {
        var files = fs_1.default.readdirSync(path_1.default.join(basedir, 'View', 'images')).filter(function (file) {
            return ['png', 'jpg', 'jpeg', 'svg']
                .includes(path_1.default.extname(file).slice(1));
        });
        res.send(files);
    }
    catch (exc) {
        logger("Error processing request '/api/get_images_list'.\r\nfilename: " + __dirname, exc);
        error_handler_404(res, exc);
    }
});
exports.default = router;
//# sourceMappingURL=main_routes.js.map