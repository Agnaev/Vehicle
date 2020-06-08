/** Каррирование функции, т.е. превращение фцнкции из вида f(a, b, c) в f(a)(b)(c)
 * @param {Function} func функция которую надо каррировать*/
function Currying(func: Function) {
    return function curried(...args: Array<any>) {
        return args.length >= func.length ? func.apply(this, args) : curried.bind(this, ...args);
    }
}

export type db_item = {
    Id: number,
    Name: string,
    Description: string,
    MinValue: number,
    MaxValue: number
}

export type response_type = {
    [key: number]: number
}

export type generator_type = {
    data: response_type,
    init?: true
}

/** Непосредственно функция генерации новых данных
 * @param { Array<db_item> } types метрики из базы данных
 * @param { generator_type } last_res последний результат работы функции
 */
const data_generator = (types: Array<db_item>, last_res: generator_type): response_type => {
    const generator = ({ min, max }) => Math.round(Math.random() * (max - min) + min);

    const result: response_type = {};
    for (const { Id, MinValue: min, MaxValue: max } of types) {
        const sended = { min, max };
        if(!last_res.init) {
            if(last_res[Id] - 5 >= min) {
                sended.min = last_res[Id] - 5;
            }

            if(last_res[Id] + 5 <= max) {
                sended.max = last_res[Id] + 5;
            }
        };
        result[Id] = generator(sended);
    }
    return result;
};

export const generator = Currying(data_generator);

