"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config = require('../config');
var path_1 = tslib_1.__importDefault(require("path"));
var local_config = tslib_1.__assign(tslib_1.__assign({}, config), { debug: true, error_handler_404: void 0 });
local_config.error_handler_404 = function (res, exc) {
    res.status(404).render(path_1.default.join(local_config.basedir, 'View', '404.hbs'), {
        exc: local_config.debug && isEmptyObject(exc) ? exc : 'Произошла неизвестная ошибка'
    });
};
function isEmptyObject(obj) {
    for (var item in obj) {
        if (obj.hasOwnProperty(item)) {
            return true;
        }
    }
    return false;
}
exports.default = local_config;
//# sourceMappingURL=config.js.map