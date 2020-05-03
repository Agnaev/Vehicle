// @ts-check
'use strict'
const { makeRequest } = require('./db_connection');
const { logger } = require('../config');

module.exports = {
    async Create({data}) {
        try {
            if(!data || typeof data === 'object' && Object.keys(data).length === 0 ||
                data instanceof Array && data.length === 0) {
                return false;
            }
            let requestString = 'INSERT INTO MetricsValues (TypeId, Value) Values ';
            if(typeof data === 'string') {
                data = JSON.parse(data);
            }
            if(data instanceof Array) {
                if(!data.length) {
                    console.log('no arrive data create metric values')
                    return;
                }
                Object.values(data).forEach(item => 
                    requestString = Object.entries(item).reduce((state, item) => {
                        state += `(${item[0]}, ${item[1]}),`;
                        return state;
                    }, 
                    requestString)
                );
                await makeRequest(requestString.replace(/,$/, ''));
                return true;
            }
            else if('Value' in data && 'Id' in data) {
                await makeRequest(requestString + `(${data.Id}, ${data.Value})`);
                return true;
            }
            else if('Value' in data && 'TypeId' in data) {
                await makeRequest(requestString + `(${data.TypeId}, ${data.Value})`)
                return true;
            }
            return false;
        }
        catch (exc) {
            logger(`An error occurred while querying the database to create metric values. filename: ${__dirname}.\r\nError: ${exc}`);
            return exc;
        }
    },

    async Delete() {
        try {
            await makeRequest(`DELETE FROM MetricsValues`);
            return true;
        }
        catch (exc) {
            logger(`An error occurred while deleting data from the metrics table of values. filename: ${__dirname}.\r\nError: ${exc}`);
            return exc;
        }
    },

    async Get() {
        try {
            const { 
                recordsets: [
                    data
                ] 
            } = await makeRequest(`
                SELECT Name, Value, MinValue, MaxValue, TypeId
                FROM MetricsValues AS V 
                JOIN MetricsTypes AS T ON V.TypeId = T.Id`);
            return data;
        }
        catch (exc) {
            logger(`An error occurred while retrieving data from the metrics table of values. filename: ${__dirname}.\r\nError: ${exc}`);
            return exc;
        }
    }
}
