// @ts-check
'use strict';
import chartCreate from './Chart.js';
import { } from './notify.min.js';
import { slider, fetch_json } from './common.js';

(window['redrawCharts'] = () => {
    Promise.all([
        fetch_json('/api/metric_values/get'),
        fetch_json('/api/metrics/get')
    ])
        .then(([
            values,
            metrics
        ]) => {
            $('canvas.chartjs-render-monitor').map((_, v) => v.remove());
            return metrics.forEach(({ Id, Name }) => {
                const chart = chartCreate(Name);
                values
                    .filterWithRemove(({ TypeId }) => TypeId === Id)
                    .map(
                        /**@param {{Value:number}} arg0
                         * @param {number} index */
                        ({ Value }, index) => chart.push(index + 1, Value));
                chart.update();
            });
        });
})();
slider();

