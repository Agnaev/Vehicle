"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var request_promise_1 = tslib_1.__importDefault(require("request-promise"));
var config = tslib_1.__importStar(require("../config"));
var Observer_1 = require("./Observer");
var default_1 = (function (_super) {
    tslib_1.__extends(default_1, _super);
    function default_1(data_generator) {
        var _this = _super.call(this) || this;
        _this.IsGeneratorWork = false;
        _this.count = 0;
        _this.storage = [];
        _this.generator = data_generator;
        _this.data = _this.generator({
            init: true
        });
        return _this;
    }
    default_1.prototype.subscribe = function (callback) {
        var _this = this;
        _super.prototype.subscribe.call(this, callback);
        if (!this.IsGeneratorWork) {
            this.UpdateData();
        }
        return function () { return _super.prototype.unsubscribe.call(_this, callback); };
    };
    default_1.prototype.UpdateData = function () {
        if (this.IsGeneratorWork) {
            return;
        }
        this.IsGeneratorWork = true;
        (function interval() {
            this.data = this.generator(this.data);
            this.broadcast();
            if (this.subscribers.length) {
                setTimeout(interval.bind(this), 1000);
            }
            else {
                this.IsGeneratorWork = false;
            }
        }).call(this);
    };
    default_1.prototype.broadcast = function () {
        if (config.default.writeToDatabase) {
            if (this.count++ < config.default.countWriteToDb) {
                this.storage.push(this.data);
            }
            else {
                request_promise_1.default({
                    method: 'post',
                    url: "http" + (config.default.isHttps && 's' || '') + "://" + config.default.ip + ":" + config.default.port + "/api/metric_values/create",
                    form: {
                        data: JSON.stringify(this.storage)
                    }
                });
                this.storage.splice(0, this.storage.length);
                this.count = 0;
            }
        }
        _super.prototype.broadcast.call(this, JSON.stringify(this.data));
    };
    return default_1;
}(Observer_1.Observer));
exports.default = default_1;
//# sourceMappingURL=DataSender.js.map