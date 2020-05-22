// @ts-check
'use strict';
import ChartCreate from './Chart.js';
import { } from './minifyjs/notify.min.js';
import { slider, fetch_json } from './common.js';

(window['redrawCharts'] = () => {
    Promise.all([
        fetch_json('/api/states'),
        fetch_json('/api/states/list'),
        fetch_json('/api/metric_values'),
        fetch_json('/api/metrics')
    ])
        .then(([states, STATES, ...args]) => {
            return [...args, states.reduce((result, item) => ({
                ...result,
                [item.MetricTypeId]: item.MetricTypeId in result ? [...result[item.MetricTypeId], item] : [item]
            }), {}), STATES];
        })
        .then(([
            values,
            metrics,
            states,
            STATES
        ]) => {
            $('canvas.chartjs-render-monitor').map((_, v) => v.remove());
            const getState = (Id, val) => states[Id].find(x => x.MinValue <= val && x.MaxValue >= val).StateId;
            return metrics.forEach(({ Id, Name, MinValue, MaxValue }) => {
                const chart = new ChartCreate(Name, MinValue, MaxValue);
                values.filterWithRemove(({ TypeId }) => TypeId === Id)
                    .map(
                        /**@param {{Value:number}} arg0
                         * @param {number} index */
                        ({ Value }, index) => chart.push(index + 1, Value, STATES[getState(Id, Value)].color));
                chart.update();
            });
        });
})();

slider();

