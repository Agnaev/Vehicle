// @ts-check
'use strict';

module.exports.Observer = class {
    /** @param {Function} data_generator */
    constructor(data_generator) {
        /** @type {Function[]} */
        this.subscribers = [];
        /** @type {Function} */
        this.generator = data_generator;
        this.generatorIsWork = false;
        this.data = this.generator({ init: true });
    }

    /** Send broadcast message */
    broadcast() {
        this.subscribers.forEach(
            /**@param {Function} subscriber callback function */
            subscriber => subscriber(
                JSON.stringify(this.data)
            )
        );
    }

    UpdateData() {
        (function interval() {
            this.data = this.generator(this.data);
            this.broadcast();
            if (this.subscribers.length) {
                setTimeout(interval.bind(this), 1000);
            }
            else {
                this.generatorIsWork = false;
            }
        }).call(this);
    }

    /**subscribe
     * @param {Function} callback Function that will be called.
     * @returns {Function} unsubscribe function
     */
    subscribe(callback) {
        this.subscribers.push(callback);
        if (!this.generatorIsWork) {
            this.generatorIsWork = true;
            this.UpdateData();
        }
        return () => this.unsubscribe(callback);
    }
    
    /**remove listener
     * @param {Function} fn unsubscribe function
     * @returns {void | Error}
     */
    unsubscribe(fn) {
        if (!this.subscribers.includes(fn)) {
            return new Error('Selected function is not a subscriber!');
        }
        this.subscribers = this.subscribers.filter(x => x != fn);
    }
};
