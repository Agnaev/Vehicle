// @ts-check

const ws = require('ws');
const {web_socket_port} = require('../config');
const {Observer} = require('./Observer');
const {makeRequest} = require('./db_request')

const webSocketServer = new ws.Server({
    port: web_socket_port
})

/**
 * @param {{min:number, max:number}} param0 object containing minimum and maximum values 
 * @returns {number} Random value
 */
const rand = ({min, max}) => Math.floor( Math.abs( Math.random() ) * (max - min) + min );


const main = async () => {
    const data_from_db = await makeRequest('select * from MetricsTypes')
    const types = data_from_db.recordsets[0];

    /** функция равномерной генерации чисел
     * @param {{ init?: boolean; value?: number; Id?: number; }} last_res последний результат работы данной функции; при первом запуске передается объект { init: true }
     * @returns {{ Id: number; value: number }} Result
     */
    const uniform_number_generation = last_res => {
        const result = types.map((item, iter) => {
            const res = {
                Id: item.Id
            };
            if(last_res.init){
                res.value = rand({ min: item.MinValue, max: item.MaxValue })
            }
            else {
                const min = last_res[iter]['value'] - 5 < item.MinValue ? item.MinValue : last_res[iter]['value'] - 5;
                const max = last_res[iter]['value'] + 5 > item.MaxValue ? item.MaxValue : last_res[iter]['value'] + 5;
                res.value = rand({ min, max })
            }
            return res;
        })
        return result;
    }

    const observer = new Observer(uniform_number_generation);
    observer.UpdateData();

    webSocketServer.on('connection', (socket, request) => {
        const unsubscribe = observer.subscribe(data => socket.send(JSON.stringify(data)))

        socket.on('close', (socket, request) => {
            unsubscribe();
        })
    })
}

main()


