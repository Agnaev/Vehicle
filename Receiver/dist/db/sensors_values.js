"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = exports.Delete = exports.Create = void 0;
var tslib_1 = require("tslib");
var db_connection_1 = require("./db_connection");
var config_1 = tslib_1.__importDefault(require("../config"));
var logger = config_1.default.logger;
function Create(_a) {
    var data = _a.data;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var requestString, _i, data_1, item, exc_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    if (!data || typeof data === 'object' && Object.keys(data).length === 0 ||
                        data instanceof Array && data.length === 0) {
                        return [2, false];
                    }
                    requestString = 'INSERT INTO SensorsValues (TypeId, Value) Values ';
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }
                    if (!(data instanceof Array)) return [3, 2];
                    if (!data.length) {
                        console.log('no arrive data create sensors values');
                        return [2, false];
                    }
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        item = data_1[_i];
                        requestString = Object.entries(item)
                            .reduce(function (state, _item) {
                            return state + ("(" + _item[0] + ", " + _item[1] + "),");
                        }, requestString);
                    }
                    return [4, db_connection_1.makeRequest(requestString.replace(/,$/, ''))];
                case 1:
                    _b.sent();
                    return [2, true];
                case 2:
                    if (!('Value' in data && 'Id' in data)) return [3, 4];
                    return [4, db_connection_1.makeRequest(requestString + ("(" + data.Id + ", " + data.Value + ")"))];
                case 3:
                    _b.sent();
                    return [2, true];
                case 4:
                    if (!('Value' in data && 'TypeId' in data)) return [3, 6];
                    return [4, db_connection_1.makeRequest(requestString + ("(" + data.TypeId + ", " + data.Value + ")"))];
                case 5:
                    _b.sent();
                    return [2, true];
                case 6: return [2, false];
                case 7:
                    exc_1 = _b.sent();
                    logger("An error occurred while querying the database to create sensors values. filename: " + __dirname + ".\r\nError: " + exc_1);
                    return [2, exc_1];
                case 8: return [2];
            }
        });
    });
}
exports.Create = Create;
function Delete() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var exc_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, db_connection_1.makeRequest("DELETE FROM SensorsValues")];
                case 1:
                    _a.sent();
                    return [2, true];
                case 2:
                    exc_2 = _a.sent();
                    logger("An error occurred while deleting data from the sensors table of values. filename: " + __dirname + ".\r\nError: " + exc_2);
                    return [2, exc_2];
                case 3: return [2];
            }
        });
    });
}
exports.Delete = Delete;
function Get() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var data, exc_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, db_connection_1.makeRequest("\n            SELECT Name, Value, MinValue, MaxValue, TypeId\n            FROM SensorsValues AS V \n            JOIN SensorsTypes AS T ON V.TypeId = T.Id")];
                case 1:
                    data = (_a.sent()).recordsets[0];
                    return [2, data];
                case 2:
                    exc_3 = _a.sent();
                    logger("An error occurred while retrieving data from the sensors table of values. filename: " + __dirname + ".\r\nError: " + exc_3);
                    return [2, exc_3];
                case 3: return [2];
            }
        });
    });
}
exports.Get = Get;
//# sourceMappingURL=sensors_values.js.map