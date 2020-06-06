"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = exports.Update = exports.Create = exports.GetMetrics = void 0;
var tslib_1 = require("tslib");
var db_connection_1 = require("./db_connection");
var config_1 = tslib_1.__importDefault(require("../config"));
var logger = config_1.default.logger;
function GetMetrics() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var types, exc_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, db_connection_1.makeRequest("SELECT * FROM MetricsTypes")];
                case 1:
                    types = (_a.sent()).recordsets[0];
                    return [2, types];
                case 2:
                    exc_1 = _a.sent();
                    logger("file: types; function: GetMetrics\r\nerror", exc_1);
                    return [2, exc_1];
                case 3: return [2];
            }
        });
    });
}
exports.GetMetrics = GetMetrics;
function Create(item) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var requestResult, count, metricId, result, exc_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4, db_connection_1.makeRequest("\n                SELECT COUNT(*) as count\n                FROM MetricsTypes\n                WHERE Name LIKE '" + item.Name + "'\n            ")];
                case 1:
                    requestResult = (_a.sent()).recordsets[0][0];
                    count = requestResult.count;
                    if (!(count > 0)) return [3, 2];
                    throw "file: " + __dirname + "; function: create;\r\n Item with selected name " + item.Name + " exist.";
                case 2:
                    if (!(item.MinValue > item.MaxValue)) return [3, 3];
                    throw "file: " + __dirname + "; function: Create;\r\n Incorrect min and max values, min value(" + item.MinValue + ") greater than max value(" + item.MaxValue + ")";
                case 3: return [4, db_connection_1.makeRequest("\n                        INSERT INTO MetricsTypes([Name], [Description], [MinValue], [MaxValue]) \n                        OUTPUT inserted.Id\n                        VALUES ('" + item.Name + "', '" + item.Description + "', '" + item.MinValue + "', '" + item.MaxValue + "');\n                    ")];
                case 4:
                    metricId = (_a.sent()).recordsets[0][0];
                    return [4, db_connection_1.makeRequest("\n                    SELECT * \n                    FROM MetricsTypes\n                    WHERE Id = '" + metricId.Id + "'\n                ")];
                case 5:
                    result = (_a.sent()).recordsets[0][0];
                    return [2, JSON.stringify(result)];
                case 6: return [3, 8];
                case 7:
                    exc_2 = _a.sent();
                    logger("file: " + __dirname + "; function: create\r\n", exc_2);
                    return [2, exc_2];
                case 8: return [2];
            }
        });
    });
}
exports.Create = Create;
function Update(item) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            db_connection_1.makeRequest("\n            UPDATE MetricsTypes\n            SET Name = '" + item.Name + "',\n            Description = '" + item.Description + "',\n            MaxValue = '" + item.MaxValue + "',\n            MinValue = '" + item.MinValue + "'\n            WHERE id = '" + item.Id + "'")
                .then(function () { return db_connection_1.makeRequest("SELECT * FROM MetricsTypes WHERE Id=" + item.Id); })
                .then(function (x) { return x.recordsets[0]; })
                .catch(function (exc) {
                logger("file: " + __dirname + "; function: Update\r\nerror", exc);
                return exc;
            });
            return [2];
        });
    });
}
exports.Update = Update;
function Delete(item) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            db_connection_1.makeRequest("DELETE FROM MetricsTypes WHERE Id = " + item.Id)
                .catch(function (exc) {
                logger("file: " + __dirname + "; function: delete\r\nerror", exc);
                return exc;
            });
            return [2];
        });
    });
}
exports.Delete = Delete;
//# sourceMappingURL=types.js.map