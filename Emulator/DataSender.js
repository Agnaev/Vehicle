// @ts-check
'use strict';

const request = require('request-promise');
const { writeToDatabase: writeTodb,
    countWriteToDb,
    ip, port,
    isHttps } = require('./config');
const { Observer } = require('./Observer');

/** @typedef { {[ key:number ]: number}} datatype */
/** @typedef { function(string): void } fntype */
/** @typedef { function(datatype | {init:true}) :datatype } generator_type */

module.exports.DataSender = class extends Observer {
    /** @param {function(datatype | {init:true}):datatype} data_generator */
    constructor(data_generator) {
        super();
        this.generator = data_generator;
        this.IsGeneratorWork = false;
        /** @type {datatype} */
        this.data = this.generator({
            init: true
        });
        if (writeTodb) {
            this.count = 0;
            /** @type {Array<datatype>} */
            this.storage = [];
        }
    }

    /** @param {fntype} callback */
    subscribe(callback) {
        super.subscribe(callback);
        if(!this.IsGeneratorWork) {
            this.UpdateData();
        }
        return () => super.unsubscribe(callback);
    }

    UpdateData() {
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
    }

    broadcast() {
        if (writeTodb) {
            if (this.count++ < countWriteToDb) {
                this.storage.push(this.data);
            }
            else {
                request({
                    method: 'post',
                    url: `http${isHttps && 's' || ''}://${ip}:${port}/api/metric_values/create`,
                    form: { 
                        data: JSON.stringify(this.storage) 
                    }
                });
                this.storage.splice(0, this.storage.length);
                this.count = 0;
            }
        }
        super.broadcast(JSON.stringify(this.data));
    }
}
