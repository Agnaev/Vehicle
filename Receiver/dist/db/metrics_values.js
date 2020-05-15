'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = exports.Delete = exports.Create = void 0;
var tslib_1 = require("tslib");
var db_connection_1 = require("./db_connection");
var config_1 = tslib_1.__importDefault(require("../config"));
var logger = config_1.default.logger;
function Create(_a) {
    var data = _a.data;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var requestString_1, exc_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    if (!data || typeof data === 'object' && Object.keys(data).length === 0 ||
                        data instanceof Array && data.length === 0) {
                        return [2, false];
                    }
                    requestString_1 = 'INSERT INTO MetricsValues (TypeId, Value) Values ';
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }
                    if (!(data instanceof Array)) return [3, 2];
                    if (!data.length) {
                        console.log('no arrive data create metric values');
                        return [2, false];
                    }
                    Object.values(data).forEach(function (item) {
                        return requestString_1 = Object.entries(item).reduce(function (state, item) {
                            state += "(" + item[0] + ", " + item[1] + "),";
                            return state;
                        }, requestString_1);
                    });
                    return [4, db_connection_1.makeRequest(requestString_1.replace(/,$/, ''))];
                case 1:
                    _b.sent();
                    return [2, true];
                case 2:
                    if (!('Value' in data && 'Id' in data)) return [3, 4];
                    return [4, db_connection_1.makeRequest(requestString_1 + ("(" + data.Id + ", " + data.Value + ")"))];
                case 3:
                    _b.sent();
                    return [2, true];
                case 4:
                    if (!('Value' in data && 'TypeId' in data)) return [3, 6];
                    return [4, db_connection_1.makeRequest(requestString_1 + ("(" + data.TypeId + ", " + data.Value + ")"))];
                case 5:
                    _b.sent();
                    return [2, true];
                case 6: return [2, false];
                case 7:
                    exc_1 = _b.sent();
                    logger("An error occurred while querying the database to create metric values. filename: " + __dirname + ".\r\nError: " + exc_1);
                    return [2, exc_1];
                case 8: return [2];
            }
        });
    });
}
exports.Create = Create;
function Delete() {
    return db_connection_1.makeRequest("DELETE FROM MetricsValues")
        .then(function (x) { return true; })
        .catch(function (exc) {
        logger("An error occurred while deleting data from the metrics table of values. filename: " + __dirname + ".\r\nError: " + exc);
        return exc;
    });
}
exports.Delete = Delete;
function Get() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var data, exc_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, db_connection_1.makeRequest("\n            SELECT Name, Value, MinValue, MaxValue, TypeId\n            FROM MetricsValues AS V \n            JOIN MetricsTypes AS T ON V.TypeId = T.Id")];
                case 1:
                    data = (_a.sent()).recordsets[0];
                    return [2, data];
                case 2:
                    exc_2 = _a.sent();
                    logger("An error occurred while retrieving data from the metrics table of values. filename: " + __dirname + ".\r\nError: " + exc_2);
                    return [2, exc_2];
                case 3: return [2];
            }
        });
    });
}
exports.Get = Get;
//# sourceMappingURL=metrics_values.js.map