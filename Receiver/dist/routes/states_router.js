"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = require("express");
var states_1 = require("../db/states");
var router = express_1.Router();
var sender = function (status, data) {
    this.status(status).send(status === 500 && data.Message || data);
};
var error_sender = function (_a) {
    var message = _a.message;
    return sender.call(this, 500, message);
};
var success_sender = function (data) {
    return sender.call(this, 200, data);
};
router.get('/', function (req, res) {
    states_1.get()
        .then(success_sender.bind(res))
        .catch(error_sender.bind(res));
});
router.post('/', function (req, res) {
    states_1.create(req.body)
        .then(success_sender.bind(res))
        .catch(error_sender.bind(res));
});
router.put('/', function (req, res) {
    states_1.update(req.body)
        .then(success_sender.bind(res))
        .catch(error_sender.bind(res));
});
router.delete('/', function (req, res) {
    states_1.deleteState(req.body)
        .then(success_sender.bind(res))
        .catch(error_sender.bind(res));
});
router.get('/list', function (req, res) {
    var colors = new Proxy(['red', 'yellow', 'green'], {
        get: function (target, prop) {
            return target[+prop - 1];
        }
    });
    states_1.states_list()
        .then(function (data) {
        return data.reduce(function (result, item) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, result), (_a = {}, _a[item.Id] = {
                Name: item.Name,
                color: colors[item.Id]
            }, _a)));
        }, {});
    })
        .then(success_sender.bind(res))
        .catch(error_sender.bind(res));
});
exports.default = router;
//# sourceMappingURL=states_router.js.map