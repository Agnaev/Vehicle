"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFile = void 0;
var tslib_1 = require("tslib");
var fs_1 = tslib_1.__importDefault(require("fs"));
var config_1 = tslib_1.__importDefault(require("../config"));
var logger = config_1.default.logger;
function copyFile(from, to) {
    try {
        fs_1.default.copyFileSync(from, to);
    }
    catch (exc) {
        logger("Error while copying file " + from + " to " + to + ". filename: " + __dirname + ".\r\nError: " + exc);
    }
}
exports.copyFile = copyFile;
//# sourceMappingURL=helper.js.map