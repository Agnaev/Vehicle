'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var body_parser_1 = tslib_1.__importDefault(require("body-parser"));
var path_1 = tslib_1.__importDefault(require("path"));
var db_connection_1 = require("./db/db_connection");
var config_1 = tslib_1.__importDefault(require("./config"));
var router_1 = tslib_1.__importDefault(require("./routes/router"));
var helper_1 = require("./helper/helper");
var port = config_1.default.port, host = config_1.default.host, logger = config_1.default.logger, basedir = config_1.default.basedir, error_handler_404 = config_1.default.error_handler_404;
var app = express_1.default();
app.set("view engine", "hbs");
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(basedir, 'View')));
app.use(function (req, res, next) {
    logger("middleware " + req.method + " ip: " + req.ip + " request: " + req.path);
    next();
});
app.use('/api/metric_values', router_1.default.values);
app.use('/api/metrics', router_1.default.types);
app.use('/api/cards', router_1.default.partials);
app.use('/api/states', router_1.default.states);
app.use('/', router_1.default.main);
app.use(function (req, res) {
    logger("Client with ip: " + req.ip + " got 404 error with request: " + req.originalUrl);
    error_handler_404(res, 'Страница не найдена.');
});
app.listen(port, host, function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var db_check, exc_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                db_check = db_connection_1.DatabaseCheck();
                helper_1.copyFile(path_1.default.join(basedir, 'node_modules', 'jquery', 'dist', 'jquery.min.js'), path_1.default.join(basedir, 'View', 'scripts', 'minifyjs', 'jquery.min.js'));
                return [4, db_check];
            case 1:
                _a.sent();
                logger("server has been started at " + host + ":" + port + ".");
                return [3, 3];
            case 2:
                exc_1 = _a.sent();
                logger('Error starting application.', exc_1);
                process.exit(1);
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
//# sourceMappingURL=server.js.map