"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = require("express");
var config_1 = tslib_1.__importDefault(require("../config"));
var values = tslib_1.__importStar(require("../db/metrics_values"));
var logger = config_1.default.logger;
var router = express_1.Router();
function local_logger(res, action, exc) {
    logger("Error while " + action + " metrics values. filename: " + __dirname + ".\r\nError" + exc);
    res.sendStatus(500);
}
function send(data) {
    data ? this.status(200).send(data) : this.sendStatus(200);
}
router.get('/', function (req, res) {
    values.Get()
        .then(send.bind(res))
        .catch(local_logger.bind(null, res, 'getting'));
});
router.post('/', function (req, res) {
    values.Create(req.body)
        .then(send.bind(res))
        .catch(local_logger.bind(null, res, 'adding'));
});
router.delete('/', function (req, res) {
    values.Delete()
        .then(send.bind(res, null))
        .catch(local_logger.bind(null, res, 'deleting'));
});
exports.default = router;
//# sourceMappingURL=metrics_values.js.map