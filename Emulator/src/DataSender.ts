import request from 'request-promise';
import * as config from '../config';
import { Observer, subscribe_fn } from './Observer';
import { generator_type, response_type } from './data_generator';

export default class extends Observer {
    generator: any;
    IsGeneratorWork: boolean = false;
    data: response_type;
    count: number = 0;
    storage: Array<response_type> = [];

    /** @param {(data:generator_type) => response_type} data_generator */
    constructor(data_generator: (data: generator_type) => response_type) {
        super();
        this.generator = data_generator;
        /** @type {response_type} */
        this.data = this.generator({
            init: true
        });
    }

    subscribe(callback: subscribe_fn): () => void {
        super.subscribe(callback);
        if (!this.IsGeneratorWork) {
            this.UpdateData();
        }
        return super.unsubscribe.bind(this, callback);
    }

    UpdateData(): void {
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

    broadcast(): void {
        const { writeToDatabase, countWriteToDb } = config.default;
        if (writeToDatabase) {
            if (this.count++ < countWriteToDb) {
                this.storage.push(this.data);
            }
            else {
                const {
                    isHttps,
                    server: {
                        host, 
                        port
                    }
                } = config.default;
                request({
                    method: 'post',
                    url: `http://${host}:${port}/api/sensors_values/`,
                    form: {
                        data: JSON.stringify(this.storage)
                    }
                });
                this.storage.splice(0, this.storage.length);
                this.count = 0;
            }
        }
        if (global['mydata']) {
            const fn_foreach = function (data: { Id: number, val: string | number }) {
                if (data?.Id in this.data && Number.isInteger(+data?.val)) {
                    this.data[data.Id] = data.val;
                }
            }.bind(this);

            global['mydata'].forEach(fn_foreach);
            global['mydata'] = undefined;
        }

        super.broadcast(JSON.stringify(this.data));
    }
}
