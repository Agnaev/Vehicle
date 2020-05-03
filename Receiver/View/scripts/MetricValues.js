import { } from './jquery.min.js';
import { } from './Chart.min.js';

const chartCreate = (document, title) => {  
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    $('#chartContainer').append(canvas);
    const chart = new Chart(context, {
        type: 'bar',
        data: {
            labels: 0,
            datasets: [{
                label: title,
                //data: data.map(x => x.Value),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })

    return {
        push(label, data) {
            chart.data.labels.push(label);
            chart.data.datasets.forEach(dataset => dataset.data.push(data));
        },
        update() {
            chart.update();
        }
    }
}

Array.prototype.filterWithRemove = function (callback) {
    const indexes = [];
    this.forEach((value, index, array) => {
        if (callback(value, index, array)) {
            indexes.push(index);
        }
    });
    return indexes.map((index, shift) => this.splice(index - shift, 1)[0]);
};

const fetch_data = (url, options = {}) => fetch(url, options).then(x => x.json());

(async function () {
    const images = await fetch_data('/api/get_images_list');
    (function interval() {
        this.slider.setAttribute('src', '/images/' + this.images[this.pointer]);
        this.pointer = this.pointer + 1 === this.images.length ? 0 : this.pointer + 1;
        setTimeout(interval.bind(this), 5000);
    }).call({
        pointer: 0, 
        images, 
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
        const chart = chartCreate(document, Name);
        indexed_data[Id].map((x, index) => chart.push(index + 1, x.Value));
        chart.update();
    });
})();