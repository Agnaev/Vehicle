"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mssql_1 = require("mssql");
var config = tslib_1.__importStar(require("../config"));
exports.makeRequest = function (requestString) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var connectionPool, pool, data, exc_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                connectionPool = new mssql_1.ConnectionPool(config.default.db_config);
                return [4, connectionPool.connect()];
            case 1:
                pool = _a.sent();
                return [4, pool.query(requestString)];
            case 2:
                data = _a.sent();
                pool.close();
                return [2, data];
            case 3:
                exc_1 = _a.sent();
                config.default.logger("file: " + __dirname + " function: makeRequest", exc_1);
                return [2, exc_1];
            case 4: return [2];
        }
    });
}); };
//# sourceMappingURL=db_request.js.map