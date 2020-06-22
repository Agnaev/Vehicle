import { } from './minifyjs/Chart.min.js';
import { } from './minifyjs/jquery.min.js';

Chart.pluginService.register({
    afterDatasetsUpdate({ chart, legend }) {
        const bgcolors = chart.data.datasets[0].backgroundColor;
        const legendItem = legend.legendItems[0];
        legendItem.fillStyle = bgcolors[bgcolors.length - 2];
        legendItem.strokeStyle = bgcolors[bgcolors.length - 2];
    }
});

export default class {
    constructor(label, min, max) {
        const canvas = document.createElement('canvas');
        $('#chartContainer').append(canvas);
        this.label = label;
        this.chart = new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: 0,
                datasets: [{
                    label,
                    //data: data.map(x => x.Value),
                    backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                    borderColor: ['rgba(255, 99, 132, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    onClick: null,
                    display: true,
                    labels: {
                        fontSize: 20,
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            min,
                            max
                        }
                    }]
                }
            }
        });
    }

    changeColor(color) {
        const ds = this.chart.data.datasets[0];
        ds.borderColor.splice(ds.borderColor.length - 1, 0, color);
        ds.backgroundColor.splice(ds.backgroundColor.length - 1, 0, color);
        return this;
    }

    push(label, data) {
        const this_data = this.chart.data;
        this_data.labels.push(label);
        this_data.datasets.forEach(dataset => dataset.data.push(data));
        return this;
    }

    update() {
        this.chart.update();
        return this;
    }

    removeData() {
        const ds = this.chart.data;
        ds.datasets[0].data.splice(0);
        ds.labels.splice(0);
        this.update();
    }

    changeLabel(state) {
        this.chart.data.datasets[0].label = `${this.label} - ${state}`;
        return this;
    }
}
