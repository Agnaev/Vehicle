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
var createType = function (count) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, db_connection_1.makeRequest("\n        INSERT INTO MetricsTypes(Name, Description, MinValue, MaxValue)\n        OUTPUT INSERTED.Id\n        VALUES ('" + count + "', '" + count + "', 0, 100);\n    ")
                    .then(function (x) { return x.recordsets[0][0]['Id']; })
                    .then(function (Id) {
                    return db_connection_1.makeRequest("\n            INSERT INTO MetricsStates (MetricTypeId, StateId, MinValue, MaxValue)\n            VALUES (" + Id + ", 1, 0, 25),\n            (" + Id + ", 2, 26, 50),\n            (" + Id + ", 3, 51, 100);\n        ");
                })];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
var experimentalNumber = 1;
fs_1.default.mkdirSync(path_1.default.join(basedir, 'statistic', 'experiment_' + experimentalNumber), {
    recursive: true
});
router.post('/api/statistic', function (req, res) {
    db_connection_1.makeRequest("SELECT COUNT(*) as count FROM MetricsTypes")
        .then(function (x) { return x.recordsets[0][0]['count']; })
        .then(function (count) {
        if (count > 100) {
            db_connection_1.makeRequest('DELETE FROM MetricsStates')
                .then(function () { return db_connection_1.makeRequest("DELETE FROM MetricsTypes"); })
                .catch(function (x) { return console.log('110', x); });
            count = 0;
            experimentalNumber += 1;
        }
        if (experimentalNumber > 10) {
            process.exit(0);
        }
        else {
            fs_1.default.mkdirSync(path_1.default.join(basedir, 'statistic', 'experiment_' + experimentalNumber), {
                recursive: true
            });
        }
        fs_1.default.writeFile(path_1.default.join(basedir, 'statistic', 'experiment_' + experimentalNumber, count + '_types.txt'), Object.keys(req.body)[0].toString(), function () { });
        return count;
    })
        .then(function (count) {
        for (var i = count + 1; i <= count + 10; i++) {
            createType(i);
        }
        res.sendStatus(200);
    })
        .catch(function (exc) { return res.status(500).send(exc); });
});
var init_db = function (res) {
    db_connection_1.makeRequest("SELECT COUNT(*) as count FROM MetricsTypes")
        .then(function (x) { return x.recordsets[0][0]['count']; })
        .then(function (count) { return count == 0; })
        .then(function (isNeed) {
        if (isNeed) {
            var types = [];
            for (var i = 1; i <= 10; i++) {
                types.push(createType(i));
            }
            Promise.all(types)
                .then(function () { return res.status(200).send(true); })
                .catch(function (exc) { return res.status(500).send(exc); });
        }
        else
            res.status(500).send(false);
    });
};
router.get('/first_type_init', function (req, res) {
    init_db(res);
});
router.get('/clear_db', function (req, res) {
    db_connection_1.makeRequest("\n        DELETE FROM MetricsStates;\n        DELETE FROM MetricsTypes;\n    ")
        .then(function () { return init_db(res); });
});
exports.default = router;
//# sourceMappingURL=main_routes.js.map