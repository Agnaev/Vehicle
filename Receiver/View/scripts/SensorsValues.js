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
            const _states = {};
            for(const item of states) {
                Object.assign(_states, {
                    [item.SensorTypeId]: [..._states[item.SensorTypeId] ?? []].concat(item)
                })
            }
            
            return [...args, _states, STATES];
        })
        .then(([
            values,
            sensors,
            states,
            STATES
        ]) => {
            $('canvas.chartjs-render-monitor').map((_, v) => v.remove());
            /**
             * Функция для получения состояния по значению сенсора
             * @param {number} Id 
             * @param {number} val 
             */
            function getState(Id, val) {
                for (const { MinValue: min, MaxValue: max, StateId } of states[Id]) {
                    if (min <= val && max >= val) {
                        return STATES[StateId];
                    }
                }
            }
            for (const { Id, Name, MinValue, MaxValue } of sensors) {
                const chart = new ChartCreate(Name, MinValue, MaxValue);
                values.filterWithRemove(({ TypeId }) => TypeId === Id)
                    .forEach(
                        /**@param {{Value:number}} arg0
                         * @param {number} index */
                        ({ Value }, index) => chart.push(index + 1, Value, getState(Id, Value).color)
                    );
                chart.update();
            }
        });
})();

slider();

