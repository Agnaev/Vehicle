// @ts-check
'use strict';

const {writeToDatabase: writeTodb , 
    countWriteToDb,
    ip, port, 
    isHttps} = require('./config');
const request = require('request-promise');

module.exports = class {
    /** @param {Function} data_generator */
    constructor(data_generator) {
        /** @type {Function[]} */
        this.subscribers = [];
        /** @type {Function} */
        this.generator = data_generator;
        this.IsGeneratorWork = false;
        this.data = this.generator({ init: true });
        this.count = 0;
        this.storage = [];
    }

    /** Send broadcast message */
    broadcast() {
        if(writeTodb){
            if(this.count++ < countWriteToDb) {
                this.storage.push(this.data);
            }
            else {
                request({
                    method: 'post',
                    url: `http${isHttps && 's'}://${ip}:${port}/api/metric_values/create`,
                    form: {data: JSON.stringify(this.storage)}
                });
                this.storage.splice(0, this.storage.length);
                if(this.storage.length !== 0) {
                    throw new Error('s/th wrong');
                }
                this.count = 0;
            }
        }
        this.subscribers.forEach(
            /**@param {Function} subscriber callback function */
            subscriber => subscriber(
                JSON.stringify(this.data)
            )
        );
    }

    UpdateData() {
        if(this.IsGeneratorWork){
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
    }

    /**subscribe
     * @param {Function} callback Function that will be called.
     * @returns {Function} unsubscribe function
     */
    subscribe(callback) {
        this.subscribers.push(callback);
        if (!this.IsGeneratorWork) {
            
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
