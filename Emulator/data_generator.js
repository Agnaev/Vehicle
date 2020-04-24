// @ts-check

'use strict'

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
        return types.reduce((acc, item) => {
            let temp;
            if(last_res.init){
                temp = { 
                    min: item.MinValue, 
                    max: item.MaxValue 
                };
            }
            else {
                const min = last_res[item.Id] - 5 < item.MinValue 
                    ? item.MinValue 
                    : last_res[item.Id] - 5;
                const max = last_res[item.Id] + 5 > item.MaxValue 
                    ? item.MaxValue 
                    : last_res[item.Id] + 5;
                temp = { min, max }
            }
            acc[item.Id] = rand(temp); 
            return acc;
        }, {})
    }
}
