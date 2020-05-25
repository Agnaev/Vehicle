Array.prototype.getMaxByField =
    /** @param {string | number} field */
    function (field) {
        return this.reduce((result, item) => item[field] && result > item[field] ? result : item[field], this[0][field])
    };

Array.prototype.getMinByField =
    /** @param {string | number} field */
    function (field) {
        return this.reduce((result, item) => item[field] && result < item[field] ? result : item[field], this[0][field])
    };

Object.defineProperty(Object.prototype, "getCopy", {
    value: function () {
        return JSON.parse(JSON.stringify(this)) 
    }
});

export default {}
