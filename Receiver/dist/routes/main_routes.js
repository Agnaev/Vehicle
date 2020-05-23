"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = require("express");
var fs_1 = tslib_1.__importDefault(require("fs"));
var path_1 = tslib_1.__importDefault(require("path"));
var config_1 = tslib_1.__importDefault(require("../config"));
var db_connection_1 = require("../db/db_connection");
var logger = config_1.default.logger, basedir = config_1.default.basedir, error_handler_404 = config_1.default.error_handler_404;
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
    res.send(config_1.default.web_socket);
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
router.get('/collect_stat', function (req, res) {
    res.status(200).send({ collect: config_1.default.collect_statistics });
});
router.post('/api/statistic', function (req, res) {
    db_connection_1.makeRequest("SELECT COUNT(*) as count FROM MetricsTypes")
        .then(function (x) { return x.recordsets[0][0]['count']; })
        .then(function (count) {
        fs_1.default.writeFile(path_1.default.join(basedir, 'statistic', count + '_types_1.txt'), Object.keys(req.body)[0].toString(), function () { });
        return count;
    })
        .then(function (count) {
        return db_connection_1.makeRequest("\n                INSERT INTO MetricsTypes(Name, Description, MinValue, MaxValue)\n                OUTPUT inserted.Id\n                VALUES ('" + (count + 1) + "', '" + (count + 1) + "', 0, 100)\n            ");
    })
        .then(function (x) { return x.recordsets[0][0].Id; })
        .then(function (x) {
        db_connection_1.makeRequest("\n                insert into MetricsStates (MetricTypeId, StateId, MinValue, MaxValue)\n                values (" + x + ", 1, 0, 25),\n                (" + x + ", 2, 26, 50),\n                (" + x + ", 3, 51, 100)\n            ");
    });
    res.sendStatus(200);
});
exports.default = router;
//# sourceMappingURL=main_routes.js.map