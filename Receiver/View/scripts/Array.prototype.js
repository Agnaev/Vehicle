Array.prototype['getMaxByField'] = 
/** @param {string | number} field */function(field) {
    return this.reduce((result, item) => item[field] && result > item[field] ? result : item[field], this[0][field])
};

Array.prototype['getMinByField'] = 
/** @param {string | number} field */
function(field) {
    return this.reduce((result, item) => item[field] && result < item[field] ? result : item[field], this[0][field])
}

export const groupBy = states => states.reduce((result, item) => {
    if(item.StateId === 1) result.critical.push(item);
    else if(item.StateId === 2) result.stable.push(item);
    else result.good.push(item);
    return result;
}, {critical: [], stable: [], good: []})
