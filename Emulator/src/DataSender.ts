import request from 'request-promise';
import * as config from '../../config';
import { Observer } from './Observer';

type datatype = {
    [ key:number ]: number
};

export default class extends Observer {
    generator:any;
    IsGeneratorWork:boolean = false;
    data:{ [key: number]:number };
    count:number = 0;
    storage: Array<datatype> = []

    /** @param {function(datatype | {init:true}):datatype} data_generator */
    constructor(data_generator:(data:datatype) => datatype ) {
        super();
        this.generator = data_generator;
        /** @type {datatype} */
        this.data = this.generator({
            init: true
        });
    }

    subscribe(callback: (data:string) => void) :() => void {
        super.subscribe(callback);
        if(!this.IsGeneratorWork) {
            this.UpdateData();
        }
        return () => super.unsubscribe(callback);
    }

    UpdateData():void {
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

    broadcast():void {
        if (config.default.writeToDatabase) {
            if (this.count++ < config.default.countWriteToDb) {
                this.storage.push(this.data);
            }
            else {
                request({
                    method: 'post',
                    url: `http${config.default.isHttps && 's' || ''}://${config.default.ip}:${config.default.port}/api/metric_values/create`,
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
