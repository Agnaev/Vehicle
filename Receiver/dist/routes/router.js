"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var main_routes_1 = tslib_1.__importDefault(require("./main_routes"));
var sensors_router_1 = tslib_1.__importDefault(require("./sensors_router"));
var sensors_values_1 = tslib_1.__importDefault(require("./sensors_values"));
var states_router_1 = tslib_1.__importDefault(require("./states_router"));
exports.default = {
    main: main_routes_1.default,
    types: sensors_router_1.default,
    values: sensors_values_1.default,
    states: states_router_1.default
};
//# sourceMappingURL=router.js.map