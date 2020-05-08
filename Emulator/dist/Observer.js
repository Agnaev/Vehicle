"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observer = (function () {
    function Observer() {
        this.subscribers = [];
    }
    Observer.prototype.subscribe = function (callback) {
        this.subscribers.push(callback);
    };
    Observer.prototype.unsubscribe = function (fn) {
        this.subscribers = this.subscribers.filter(function (f) { return f !== fn; });
    };
    Observer.prototype.broadcast = function (data) {
        this.subscribers.forEach(function (callback) { return callback(data); });
    };
    return Observer;
}());
exports.Observer = Observer;
//# sourceMappingURL=Observer.js.map