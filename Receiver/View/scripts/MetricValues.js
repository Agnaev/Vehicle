// @ts-check
'use strict';
import chartCreate from './Chart.js';
import { slider, fetch_json } from './common.js';

const promise_data = fetch_json('/api/metric_values/get');
const promise_metrics = fetch_json('/api/metrics/get');

Promise.all([promise_data, promise_metrics])
    .then(([data, metrics]) => {
        const indexed_data = metrics.reduce((store, { Id }) => ({
            ...store,
            [Id]: data.filterWithRemove(({ TypeId }) => TypeId === Id)
        }), {});

        metrics.forEach(({ Id, Name }) => {
            const chart = chartCreate(Name);
            indexed_data[Id].map(
                ({ Value }, index) => chart.push(index + 1, Value)
            );
            chart.update();
        });
    });

slider();
