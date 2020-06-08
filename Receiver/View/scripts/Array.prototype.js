// @ts-check
'use strict';

/** @param {string} field
 * @param {(value: number, index: number) => boolean } reducer_fn
 * @param {number} reducer_init_data
 */
function getExtremum(field, reducer_fn, reducer_init_data = this[0][field]) {
    return this.map(x => x[field]).reduce(reducer_fn, reducer_init_data);
}

/** @param {string} field */
Array.prototype['getMaxByField'] = function (field) {
    return getExtremum.call(this, field, (a, b) => a > b ? a : b);
};

/** @param {string} field */
Array.prototype['getMinByField'] = function (field) {
    return getExtremum.call(this, field, (a, b) => a < b ? a : b);
};

/**фильтрация массива с удалением элементов 
 * @param {(value: number, index: number, array: Array) => boolean} callback
 * @returns {Array} массив элементов, которые будут удалены из исходного массива
 */
Array.prototype['filterWithRemove'] = function (callback) {
    const result = [];
    for(let i = 0; i < this.length; i++) {
        if(callback(this[i], i, this)) {
            result.push(this.splice(i, 1)[0])
        }
    }
    return result
};

Storage.prototype.removeBlobs = function () {
    for (const [key, val] of Object.entries(this)) {
        if (val.startsWith('blob')) {
            this.removeItem(key);
        }
    }
};

Object.defineProperty(Object.prototype, "getCopy", {
    get: function () {
        return JSON.parse(JSON.stringify(this))
    }
});

Array.prototype['shuffle'] = function () {
    return this.reduce((res, item) => {
        const j = Math.floor(Math.random() * 150 % res.length);
        [item, res[j]] = [res[j], item];
        return res;
    }, this['getCopy']);
};

export default {}
