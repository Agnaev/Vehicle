// @ts-check
'use strict';
import chartCreate from './Chart.js';

Array.prototype['filterWithRemove'] = function (callback) {
    return this.reduce((acc, val, index, arr) => {
        if(callback(val, index, arr)) {
            acc.push(index);
        }
        return acc;
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

(async function () {
    const data = await promise_data;
    const metrics = await promise_metrics;

    const indexed_data = metrics.reduce((store, { Id }) => ({
        ...store,
        [Id]: data.filterWithRemove(x => x.TypeId === Id)
    }), {});

    metrics.forEach(({Id, Name}) => {
        const chart = chartCreate(Name);
        indexed_data[Id].map((x, index) => chart.push(index + 1, x.Value));
        chart.update();
    });
})();

document.addEventListener('DOMContentLoaded', e => {
    ['contextmenu', 'selectstart', 'copy', 'select', 'dragstart', 'beforecopy']
        .forEach(
            event => document.body.addEventListener(event, e => e.preventDefault())
        );
})