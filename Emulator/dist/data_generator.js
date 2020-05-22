"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function Currying(func) {
    return function curried() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args.length >= func.length
            ? func.apply(this, args)
            : function () {
                var _args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _args[_i] = arguments[_i];
                }
                return curried.apply(_this, tslib_1.__spreadArrays(args, _args));
            };
    };
}
var data_generator = function (types, last_res) {
    return types.reduce(function (result, _a) {
        var _b;
        var Id = _a.Id, MinValue = _a.MinValue, MaxValue = _a.MaxValue;
        return (tslib_1.__assign(tslib_1.__assign({}, result), (_b = {}, _b[Id] = (function (_a) {
            var min = _a.min, max = _a.max;
            return Math.floor(Math.random() * (max - min) + min);
        })(last_res.init
            ? {
                min: MinValue,
                max: MaxValue
            }
            : {
                min: last_res[Id] - 5 < MinValue ? MinValue : last_res[Id] - 5,
                max: last_res[Id] + 5 > MaxValue ? MaxValue : last_res[Id] + 5
            }), _b)));
    }, {});
};
exports.generator = Currying(data_generator);
//# sourceMappingURL=data_generator.js.map