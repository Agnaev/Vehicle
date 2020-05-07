// @ts-check
'use strict';
import chartCreate from './Chart.js';

Array.prototype['filterWithRemove'] = 
/**
 * @param {(value:number, index:number, array:Array) => boolean} callback 
 */
 function (callback) {
    return this.reduce((total, ...args) => {
        if(callback(...args)) {
            total.push(args[1]);
        }
        return total;
    }, [])
    .map(
        /** @param {number} index 
         * @param {number} shift смещение*/
        (index, shift) => this.splice(index - shift, 1)[0]
    );
};

Array.prototype['shuffle'] = function() {
    return this.reduce((acc, v, i) => {
        const j = Math.floor(Math.random() * (i + 1));
        [v, acc[j]] = [acc[j], v];
        return acc;
    }, [...this]);
};

/**
 * @param {string} url request url
 * @param {{[key:string]: string | number}} options request options
 */
const fetch_data = (url, options = {}) => fetch(url, options).then(x => x.json());
const promise_data = fetch_data('/api/metric_values/get');
const promise_metrics = fetch_data('/api/metrics/get');

fetch_data('/api/get_images_list')
.then(images => {
    (function interval() {
        this.slider.setAttribute('src', '/images/' + this.images[this.pointer]);
        this.pointer = this.pointer + 1 === this.images.length ? 0 : this.pointer + 1;
        setTimeout(interval.bind(this), 5000);
    }).call({
        pointer: 0, 
        images: images.shuffle(), 
        slider: document.querySelector('#slider') 
    });
});

Promise.all([promise_data, promise_metrics]).then(([data, metrics]) => {
    const indexed_data = metrics.reduce((store, { Id }) => ({
        ...store,
        [Id]: data.filterWithRemove(({TypeId}) => TypeId === Id)
    }), {});

    metrics.forEach(({Id, Name}) => {
        const chart = chartCreate(Name);
        indexed_data[Id].map(({Value}, index) => chart.push(index + 1, Value));
        chart.update();
    });
});

document.addEventListener('DOMContentLoaded', e => {
    ['contextmenu', 'selectstart', 'copy', 'select', 'dragstart', 'beforecopy']
        .forEach(
            event => document.body.addEventListener(event, e => e.preventDefault())
        );
})