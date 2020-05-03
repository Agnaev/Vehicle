import { } from './Chart.min.js';
import { } from './jquery.min.js';

export default function chartCreate (title) {  
    const canvas = $('<canvas>');
    const context = canvas[0].getContext('2d');
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
    });

    return {
        push(label, data) {
            chart.data.labels.push(label);
            chart.data.datasets.forEach(dataset => dataset.data.push(data));
            return this;
        },
        update() {
            chart.update();
        }
    }
}
