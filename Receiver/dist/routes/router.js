"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var main_routes_1 = tslib_1.__importDefault(require("./main_routes"));
var metrics_router_1 = tslib_1.__importDefault(require("./metrics_router"));
var metrics_values_1 = tslib_1.__importDefault(require("./metrics_values"));
var partials_router_1 = tslib_1.__importDefault(require("./partials_router"));
var states_router_1 = tslib_1.__importDefault(require("./states_router"));
exports.default = {
    main: main_routes_1.default,
    types: metrics_router_1.default,
    values: metrics_values_1.default,
    partials: partials_router_1.default,
    states: states_router_1.default
};
//# sourceMappingURL=router.js.map