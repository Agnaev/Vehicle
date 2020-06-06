"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = require("express");
var types = tslib_1.__importStar(require("../db/types"));
var config_1 = tslib_1.__importDefault(require("../config"));
var logger = config_1.default.logger;
function local_logger(res, action, exc) {
    logger("Error processing request " + action + " metric\r\nfilename:", __dirname, exc);
    res.sendStatus(500);
}
var router = express_1.Router();
router.delete('/', function (req, res) {
    types.Delete(req.body)
        .then(function () { return res.sendStatus(200); })
        .catch(local_logger.bind(null, res, 'delete'));
});
router.put('/', function (req, res) {
    types.Update(req.body)
        .then(function (data) { return res.status(200).send(data); })
        .catch(local_logger.bind(null, res, 'update'));
});
router.post('/', function (req, res) {
    types.Create(req.body)
        .then(function (data) { return res.status(200).send(data); })
        .catch(local_logger.bind(null, res, 'create'));
});
router.get('/', function (req, res) {
    types.GetMetrics()
        .then(function (data) { return res.status(200).send(data); })
        .catch(local_logger.bind(null, res, 'get'));
});
exports.default = router;
//# sourceMappingURL=metrics_router.js.map