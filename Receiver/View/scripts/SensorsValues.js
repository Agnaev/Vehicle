// @ts-check
'use strict';
import ChartCreate from './Chart.js';
import { } from './minifyjs/notify.min.js';
import { slider, fetch_json } from './common.js';

(window['redrawCharts'] = () => {
    Promise.all([
        fetch_json('/api/states'),
        fetch_json('/api/states/list'),
        fetch_json('/api/sensors_values'),
        fetch_json('/api/sensors')
    ])
        .then(([states, STATES, ...args]) => {
            return [...args, states.reduce((result, item) => ({
                ...result,
                [item.SensorTypeId]: item.SensorTypeId in result ? [...result[item.SensorTypeId], item] : [item]
            }), {}), STATES];
        })
        .then(([
            values,
            sensors,
            states,
            STATES
        ]) => {
            $('canvas.chartjs-render-monitor').map((_, v) => v.remove());
            function getStateColor(Id, val) {
                for (const { MinValue: min, MaxValue: max, StateId } of states[Id]) {
                    if (min <= val && max >= val) {
                        return STATES[StateId].color;
                    }
                }
            }
            for (const { Id, Name, MinValue, MaxValue } of sensors) {
                const chart = new ChartCreate(Name, MinValue, MaxValue);
                values.filterWithRemove(({ TypeId }) => TypeId === Id)
                    .forEach(
                        /**@param {{Value:number}} arg0
                         * @param {number} index */
                        ({ Value }, index) => chart.push(index + 1, Value, getStateColor(Id, Value))
                    );
                chart.update();
            }
        });
})();

slider();

