import { } from './Chart.min.js';
import { } from './jquery.min.js';

Chart.pluginService.register({
    afterDatasetsUpdate({chart, legend}) {
        const bgcolors = chart.data.datasets[0].backgroundColor;
        const legendItem = legend.legendItems[0];
        legendItem.fillStyle = bgcolors[bgcolors.length - 2];
        legendItem.strokeStyle = bgcolors[bgcolors.length - 2];
    }
});

export default class {
    constructor(label) {
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
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
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
    }

    push(label, data, color) {
        this.changeColor(color);
        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach(dataset => dataset.data.push(data));
        return this;
    }

    update() {
        this.chart.update();
    }

    removeData() {
        const ds = this.chart.data;
        ds.datasets[0].data.splice(0);
        ds.labels.splice(0);
        this.update();
    }

    changeLabel(state) {
        this.chart.data.datasets[0].label = `${this.label} - ${state}`
    }
}
