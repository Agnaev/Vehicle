import { } from './Chart.min.js'

export default class ChartElement {
    constructor(title) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        document.querySelector('#chartContainer').appendChild(canvas);
        this.chart = new Chart(context, {
            type: 'bar',
            data: {
                labels: 0,
                datasets: [{
                    label: title,
                    //data: values,
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
    }

    add_data(label, data) {
        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach(dataset => dataset.data.push(data));
        this.chart.update();
    }
}
