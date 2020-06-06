"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRequest = exports.DatabaseCheck = void 0;
var tslib_1 = require("tslib");
var mssql_1 = require("mssql");
var config_1 = tslib_1.__importDefault(require("../config"));
var logger = config_1.default.logger, db_config = config_1.default.db_config;
function connectToDatabase(config) {
    var _this = this;
    return function (requestString) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var connectionPool, pool, data, exc_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    connectionPool = new mssql_1.ConnectionPool(config);
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
                    logger("file: " + __dirname + " function: connect(nested function), request stirng: " + requestString, exc_1);
                    return [2, exc_1];
                case 4: return [2];
            }
        });
    }); };
}
;
exports.DatabaseCheck = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var makeRequest_1, requestResult, exc_2;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                logger('Database check...');
                makeRequest_1 = connectToDatabase(tslib_1.__assign(tslib_1.__assign({}, db_config), { database: 'master' }));
                return [4, makeRequest_1("\n            SELECT DB_ID('" + db_config.database + "') as db_id\n        ")];
            case 1:
                requestResult = (_a.sent()).recordsets[0][0];
                if (!!requestResult.db_id) return [3, 8];
                logger('database is not exist\r\nCreating database...');
                return [4, makeRequest_1("Create database " + db_config.database)];
            case 2:
                _a.sent();
                makeRequest_1 = connectToDatabase(db_config);
                return [4, makeRequest_1("\n                CREATE TABLE MetricsTypes (\n                    Id INT IDENTITY NOT NULL,\n                    [Name] NVARCHAR(100) NOT NULL,\n                    Description NVARCHAR(MAX),\n                    MaxValue INT NOT NULL,\n                    MinValue INT NOT NULL,\n                    CONSTRAINT PK_MetricsTypes PRIMARY KEY (Id),\n                    CONSTRAINT UQ_Type_name UNIQUE (Name)\n                )\n            ")];
            case 3:
                _a.sent();
                return [4, makeRequest_1("\n                CREATE TABLE MetricsValues (\n                    Id INT IDENTITY NOT NULL,\n                    TypeId INT NOT NULL,\n                    Value INT NOT NULL,\n                    CONSTRAINT PK_MetricsValuesId PRIMARY KEY(Id),\n                    CONSTRAINT FK_MetricsValue_MetricsTypes FOREIGN KEY (TypeId) REFERENCES MetricsValues(Id)\n                )\n            ")];
            case 4:
                _a.sent();
                return [4, makeRequest_1("\n                CREATE TABLE States (\n                    Id\tINT IDENTITY NOT NULL,\n                    Name NVARCHAR(MAX) NOT NULL\n                    CONSTRAINT PK_States PRIMARY KEY (Id)\n                )\n            ")];
            case 5:
                _a.sent();
                return [4, makeRequest_1("\n                CREATE TABLE MetricsStates (\n                    Id INT IDENTITY NOT NULL,\n                    MetricTypeId INT NOT NULL,\n                    StateId INT NOT NULL,\n                    MinValue INT NOT NULL,\n                    MaxValue INT NOT NULL,\n                    CONSTRAINT PK_MetricsStates PRIMARY KEY (Id),\n                    CONSTRAINT FK_MetricsStates_To_MetricTypes FOREIGN KEY (MetricTypeId) REFERENCES [dbo].[MetricsTypes](Id),\n                    CONSTRAINT FK_MetricsStates_To_States FOREIGN KEY (StateId) REFERENCES [dbo].[States]\n                )\n            ")];
            case 6:
                _a.sent();
                return [4, makeRequest_1("\n                INSERT INTO States(Name)\n                VALUES ('\u041A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435'), ('\u0421\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0435'), ('\u0425\u043E\u0440\u043E\u0448\u0435\u0435')\n            ")];
            case 7:
                _a.sent();
                logger('Database was created');
                _a.label = 8;
            case 8: return [3, 10];
            case 9:
                exc_2 = _a.sent();
                logger("Error while database checking; file: " + __dirname, exc_2);
                return [2, exc_2];
            case 10: return [2];
        }
    });
}); };
exports.makeRequest = connectToDatabase(db_config);
//# sourceMappingURL=db_connection.js.map