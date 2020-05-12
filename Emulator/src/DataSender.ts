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
        if (config.default.writeToDatabase) {
            if (this.count++ < config.default.countWriteToDb) {
                this.storage.push(this.data);
            }
            else {
                request({
                    method: 'post',
                    url: `http${config.default.isHttps && 's' || ''}://${config.default.ip}:${config.default.port}/api/metric_values/`,
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
