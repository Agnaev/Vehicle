import chartCreate from './Chart.js'

Array.prototype.filterWithRemove = function (callback) {
    const indexes = [];
    this.forEach((value, index, array) => {
        if (callback(value, index, array)) {
            indexes.push(index);
        }
    });
    return indexes.map((index, shift) => this.splice(index - shift, 1)[0]);
};

Array.prototype['shuffle'] = function() {
    let j = 0;
    this.forEach((v, i) => {
        j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    });
    return this;
}

const fetch_data = (url, options = {}) => fetch(url, options).then(x => x.json());

(async function () {
    const images = await fetch_data('/api/get_images_list');
    (function interval() {
        this.slider.setAttribute('src', '/images/' + this.images[this.pointer]);
        this.pointer = this.pointer + 1 === this.images.length ? 0 : this.pointer + 1;
        setTimeout(interval.bind(this), 5000);
    }).call({
        pointer: 0, 
        images: images.shuffle(), 
        slider: document.querySelector('#slider') 
    });
    
    const promise_data = fetch_data('/api/metric_values/get');
    const promise_metrics = fetch_data('/api/metrics/get');

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