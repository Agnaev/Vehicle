"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteState = exports.create = exports.update = exports.states_list = exports.get = void 0;
var tslib_1 = require("tslib");
var db_connection_1 = require("./db_connection");
var config_1 = tslib_1.__importDefault(require("../config"));
var logger = config_1.default.logger;
exports.get = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var requestResult;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, db_connection_1.makeRequest("SELECT * FROM SensorsStates")];
            case 1:
                requestResult = (_a.sent()).recordsets[0];
                return [2, requestResult];
        }
    });
}); };
exports.states_list = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var requestResult;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, db_connection_1.makeRequest('SELECT * FROM States')];
            case 1:
                requestResult = (_a.sent()).recordsets[0];
                return [2, requestResult];
        }
    });
}); };
exports.update = function (_a) {
    var Id = _a.Id, SensorTypeId = _a.SensorTypeId, StateId = _a.StateId, MinValue = _a.MinValue, MaxValue = _a.MaxValue;
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var exc_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4, db_connection_1.makeRequest("\n            UPDATE SensorsStates\n            SET SensorTypeId = '" + SensorTypeId + "',\n            StateId = '" + StateId + "',\n            MaxValue = '" + MaxValue + "',\n            MinValue = '" + MinValue + "'\n            WHERE id = '" + Id + "'\n        ")];
                case 1:
                    _b.sent();
                    return [2, true];
                case 2:
                    exc_1 = _b.sent();
                    logger("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F \u0432 \u0431\u0430\u0437\u0435 \u0434\u0430\u043D\u043D\u044B\u0445. File: " + __dirname + ". Error: " + exc_1);
                    return [2, false];
                case 3: return [2];
            }
        });
    });
};
exports.create = function (_a) {
    var SensorTypeId = _a.SensorTypeId, StateId = _a.StateId, MinValue = _a.MinValue, MaxValue = _a.MaxValue;
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var requestResult, result, exc_2;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4, db_connection_1.makeRequest("\n            INSERT INTO SensorsStates (SensorTypeId, StateId, MinValue, MaxValue)\n            OUTPUT inserted.Id\n            values ('" + SensorTypeId + "', '" + StateId + "', '" + MinValue + "', '" + MaxValue + "')\n        ")];
                case 1:
                    requestResult = (_b.sent()).recordsets[0][0];
                    return [4, db_connection_1.makeRequest("\n            SELECT *\n            FROM SensorsStates\n            WHERE Id=" + requestResult.Id + "\n        ")];
                case 2:
                    result = (_b.sent()).recordsets[0][0];
                    return [2, result];
                case 3:
                    exc_2 = _b.sent();
                    logger("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F \u043C\u0435\u0442\u0440\u0438\u043A\u0438. File: " + __dirname + ". Error: " + exc_2);
                    return [2, false];
                case 4: return [2];
            }
        });
    });
};
exports.deleteState = function (_a) {
    var Id = _a.Id;
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var exc_3;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4, db_connection_1.makeRequest("\n            DELETE FROM SensorsStates WHERE Id=" + Id + "\n        ")];
                case 1:
                    _b.sent();
                    return [2, true];
                case 2:
                    exc_3 = _b.sent();
                    logger("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F \u043C\u0435\u0442\u0440\u0438\u043A\u0438. File: " + __dirname + ". Error: " + exc_3);
                    return [2, false];
                case 3: return [2];
            }
        });
    });
};
//# sourceMappingURL=states.js.map