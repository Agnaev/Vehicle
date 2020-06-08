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
router.get('/list', function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var colors, _states_list, result, _i, _states_list_1, item, exc_1;
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                colors = new Proxy(['red', 'yellow', 'green'], {
                    get: function (target, prop) {
                        return target[+prop - 1];
                    }
                });
                return [4, states_1.states_list()];
            case 1:
                _states_list = _b.sent();
                result = {};
                for (_i = 0, _states_list_1 = _states_list; _i < _states_list_1.length; _i++) {
                    item = _states_list_1[_i];
                    Object.assign(result, (_a = {},
                        _a[item.Id] = {
                            Name: item.Name,
                            color: colors[item.Id]
                        },
                        _a));
                }
                success_sender.call(res, result);
                return [3, 3];
            case 2:
                exc_1 = _b.sent();
                error_sender.call(res, exc_1);
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=states_router.js.map