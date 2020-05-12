import { } from './Chart.min.js';
import { } from './jquery.min.js';

export default class {
    constructor(label) {
        const canvas = document.createElement('canvas');
        $('#chartContainer').append(canvas);
        this.chart = new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: 0,
                datasets: [{
                    label,
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
        });
    }

    push(label, data) {
        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach(dataset => dataset.data.push(data));
        return this;
    }

    update() {
        this.chart.update();
    }

    removeData() {
        this.chart.data.datasets[0].data.splice(0);
        this.chart.data.labels.splice(0);
        this.update();
    }
}
