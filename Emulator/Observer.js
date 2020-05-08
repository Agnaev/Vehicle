// @ts-check
'use strict';

/** @typedef { function(string): void } fntype */

module.exports.Observer = class {
    constructor(){
        /** @type {Array<fntype>} */
        this.subscribers = [];
    }

    /** @param {fntype} callback */
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    /** @param {fntype} fn */
    unsubscribe(fn) {
        this.subscribers = this.subscribers.filter(f => f !== fn);
    }

    /** @param {string} data */
    broadcast(data) {
        this.subscribers.forEach(
            callback => callback(data)
        )
    }
}
