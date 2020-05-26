// @ts-check
'use strict';

Array.prototype['getMaxByField'] = function (field) {
    return this.reduce((result, item) => item[field] && result > item[field] && result || item[field], this[0][field])
};

Array.prototype['getMinByField'] = function (field) {
    return this.reduce((result, item) => item[field] && result < item[field] && result || item[field], this[0][field])
};

Array.prototype['filterWithRemove'] = function (callback) {
    return this.reduce((total, ...args) => {
        if (callback(...args)) {
            total.push(args[1]);
        }
        return total;
    }, []).map((index, shift) => this.splice(index - shift, 1)[0]);
};

Storage.prototype.removeBlobs = function () {
    for (const [key, val] of Object.entries(this)) {
        if (val.startsWith('blob')) {
            this.removeItem(key);
        }
    }
};

Object.defineProperty(Object.prototype, "getCopy", {
    value: function () {
        return JSON.parse(JSON.stringify(this))
    }
});

Array.prototype['shuffle'] = function () {
    return this.reduce((res, item) => {
        const j = Math.floor(Math.random() * 150 % res.length);
        [item, res[j]] = [res[j], item];
        return res;
    }, this['getCopy']());
};

export default {}
