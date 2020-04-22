// @ts-check

'use strict'

module.exports.Observer = class {
    /**
     * @param {Function} data_generator
     */
    constructor(data_generator){
        /** @type {Function[]} */
        this.subscribers = [];
        /** @type {Function} */
        this.generator = data_generator;
        this.data = this.generator({init: true});
    }

    UpdateData(){
        const interval = () => {
            this.data = this.generator(this.data);
            this.broadcast(this.data);
            setTimeout(interval, 1000);
        }
        interval();
    }

    /**
     * @param {Function} callback Function that will be called.
     * @returns {Function} unsubscribe function
     */
    subscribe(callback){
        this.subscribers.push(callback);
        return () => this.unsubscribe(callback);
    }

    /**
     * @param {Function} fn remove listener
     * @returns {void | Error}
     */
    unsubscribe(fn){
        if(!this.subscribers.includes(fn)){
            return new Error('Selected function is not a subscribed!');
        }
        this.subscribers = this.subscribers.filter(x => x != fn);
    }

    /**
     * @param {Number} data
     */
    broadcast(data){
        this.subscribers.forEach(subscriber => subscriber(data));
    }
}