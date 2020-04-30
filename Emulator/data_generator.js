// @ts-check
'use strict';

/**
 * @param {{min:number, max:number}} param0 object containing minimum and maximum values 
 * @returns {number} Random value
 */
const rand = ({min, max}) => Math.floor( Math.abs( Math.random() ) * (max - min) + min );

/**
 * @param {Array<{Id: number, Name: string, MinValue: number, MaxValue: number}>} types 
 * @returns {Function} Data generator
 */

module.exports.generator = types => {
    return last_res => {
        return types.reduce((result, {Id, MinValue, MaxValue}) => {
            let range;
            if(last_res.init) {
                range = { 
                    min: MinValue, 
                    max: MaxValue 
                };
            }
            else {
                const min = last_res[Id] - 5 < MinValue ? MinValue : last_res[Id] - 5;
                const max = last_res[Id] + 5 > MaxValue ? MaxValue : last_res[Id] + 5;
                range = { min, max };
            }
            if(Id in result) {
                throw new Error(`Duplicate Error. Key ${Id} already defined in accumulator object.`);
            }
            result[Id] = rand(range); 
            return result;
        }, {});
    };
};
