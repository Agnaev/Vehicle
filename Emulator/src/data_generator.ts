/** Каррирование функции, т.е. превращение фцнкции из вида f(a, b, c) в f(a)(b)(c)
 * @param {Function} func функция которую надо каррировать*/
function Currying(func:Function) {
    return function curried() {
        const _args = Array.apply(null, arguments);
        return arguments.length >= func.length
            ? func.apply(this, arguments)
            : (...args) => curried.apply(this, [..._args, ...args]);
    }
}

type db_item = {
    Id: number, 
    Name: string, 
    Description: string,
    MinValue: number, 
    MaxValue: number
}

/** Непосредственно функция генерации новых данных
 * @param {Array<db_item>} types метрики из базы данных
 * @param {{ init:true, [key:number]:number }} last_res последний результат работы функции
 */
const data_generator = (types: Array<db_item>, last_res:{ [key:number]:number, init?:boolean}):{[key:number]:number} => types.reduce(
    (result: { [key:number]:number }, { Id, MinValue, MaxValue }) => ({
        ...result,
        [Id]: (({ min, max }) => Math.floor(Math.random() * (max - min) + min)) // iife function
            (last_res.init // call iife function here
                ? {
                    min: MinValue,
                    max: MaxValue
                }
                : {
                    min: last_res[Id] - 5 < MinValue ? MinValue : last_res[Id] - 5,
                    max: last_res[Id] + 5 > MaxValue ? MaxValue : last_res[Id] + 5
                }
            )
    }), {});

export const generator = Currying(data_generator);

