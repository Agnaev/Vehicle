// @ts-check
'use strict'
const { makeRequest } = require('./db_connection');
const { logger } = require('../config');

module.exports = {
    async Create(data) {
        try {
            let requestString = 'INSERT INTO MetricsValues (TypeId, Value) Values ';
            if(data instanceof Array){
                data.forEach(({Value, Id}) => {
                    requestString += `(${Id}, ${Value})`
                })
                await makeRequest(requestString);
            }
            else if('Value' in data && 'Id' in data) {
                await makeRequest(requestString + `(${data.Id}, ${data.Value})`);
            }
            else if('Value' in data && 'TypeId' in data) {
                await makeRequest(requestString + `(${data.TypeId}, ${data.Value})`)
            }
            return true;
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
                SELECT Name, Value, MinValue, MaxValue
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
