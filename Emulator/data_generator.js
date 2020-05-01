// @ts-check
'use strict';

/**
 * @param {{min:number, max:number}} param0 object containing minimum and maximum values 
 * @returns {number} Random value
 */
const rand = ({ min, max }) => Math.floor(Math.random() * (max - min) + min);

/** Каррирование функции, т.е. превращение фцнкции из вида f(a, b, c) в f(a)(b)(c)
 * @param {Function} func функция которую надо каррировать*/
function Currying(func) {
    return function curried() {
        return arguments.length >= func.length 
            ? func.apply(this, arguments)
            : (...args) => curried.apply(this, [...arguments, ...args]);
    }
}

/** Непосредственно функция генерации новых данных
 * @param {Array<{Id: number, Name: string, MinValue: number, MaxValue: number}>} types метрики из базы данных
 * @param {{ init:true, [key:number]:number }} last_res последний результат работы функции
 */
const data_generator = (types, last_res) => types.reduce(
    (result, { Id, MinValue, MaxValue }) => ({
        ...result,
        [Id]: (() => rand(
            last_res.init
                ? {
                    min: MinValue,
                    max: MaxValue
                }
                : {
                    min: last_res[Id] - 5 < MinValue ? MinValue : last_res[Id] - 5,
                    max: last_res[Id] + 5 > MaxValue ? MaxValue : last_res[Id] + 5
                }
        ))()
    }), {});

module.exports.generator = Currying(data_generator);
