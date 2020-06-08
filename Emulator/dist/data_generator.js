"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function Currying(func) {
    return function curried() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args.length >= func.length ? func.apply(this, args) : curried.bind.apply(curried, tslib_1.__spreadArrays([this], args));
    };
}
var data_generator = function (types, last_res) {
    var generator = function (_a) {
        var min = _a.min, max = _a.max;
        return Math.round(Math.random() * (max - min) + min);
    };
    var result = {};
    for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
        var _a = types_1[_i], Id = _a.Id, min = _a.MinValue, max = _a.MaxValue;
        var sended = { min: min, max: max };
        if (!last_res.init) {
            if (last_res[Id] - 5 >= min) {
                sended.min = last_res[Id] - 5;
            }
            if (last_res[Id] + 5 <= max) {
                sended.max = last_res[Id] + 5;
            }
        }
        ;
        result[Id] = generator(sended);
    }
    return result;
};
exports.generator = Currying(data_generator);
//# sourceMappingURL=data_generator.js.map