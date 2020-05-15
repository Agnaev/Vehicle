'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = require("express");
var types = tslib_1.__importStar(require("../db/types"));
var logger = require('../config').logger;
function local_logger(res, action, exc) {
    logger("Error processing request " + action + " metric\r\nfilename:", __dirname, exc);
    res.sendStatus(500);
}
var router = express_1.Router();
router.delete('/', function (req, res) {
    return types.Delete(req.body)
        .then(function () { return res.sendStatus(200); })
        .catch(local_logger.bind(null, res, 'delete'));
});
router.put('/', function (req, res) {
    return types.Update(req.body)
        .then(function (data) { return res.status(200).send(data); })
        .catch(local_logger.bind(null, res, 'update'));
});
router.post('/', function (req, res) {
    return types.Create(req.body)
        .then(function (data) { return res.status(200).send(data); })
        .catch(local_logger.bind(null, res, 'create'));
});
router.get('/', function (req, res) {
    return types.GetMetrics()
        .then(function (data) { return res.status(200).send(data); })
        .catch(local_logger.bind(null, res, 'get'));
});
router.get('/');
exports.default = router;
//# sourceMappingURL=metrics_router.js.map