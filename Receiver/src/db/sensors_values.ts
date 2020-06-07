import { makeRequest } from './db_connection';
import config from '../config';
import { IRecordSet } from 'mssql';

const { logger } = config;
// @ts-ignore
export async function Create({ data }): Promise<boolean> {
    try {
        if (!data || typeof data === 'object' && Object.keys(data).length === 0 ||
            data instanceof Array && data.length === 0) {
            return false;
        }
        let requestString = 'INSERT INTO SensorsValues (TypeId, Value) Values ';
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (data instanceof Array) {
            if (!data.length) {
                console.log('no arrive data create sensors values')
                return false;
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
        else if ('Value' in data && 'Id' in data) {
            await makeRequest(requestString + `(${data.Id}, ${data.Value})`);
            return true;
        }
        else if ('Value' in data && 'TypeId' in data) {
            await makeRequest(requestString + `(${data.TypeId}, ${data.Value})`)
            return true;
        }
        return false;
    }
    catch (exc) {
        logger(`An error occurred while querying the database to create sensors values. filename: ${__dirname}.\r\nError: ${exc}`);
        return exc;
    }
}

export async function Delete(): Promise<boolean> {
    try {
        await makeRequest(`DELETE FROM SensorsValues`);
        return true;
    }
    catch (exc) {
        logger(`An error occurred while deleting data from the sensors table of values. filename: ${__dirname}.\r\nError: ${exc}`);
        return exc;
    }
}

export async function Get(): Promise<IRecordSet<any>> {
    try {
        const {
            recordsets: [
                data
            ]
        } = await makeRequest(`
            SELECT Name, Value, MinValue, MaxValue, TypeId
            FROM SensorsValues AS V 
            JOIN SensorsTypes AS T ON V.TypeId = T.Id`);
        return data;
    }
    catch (exc) {
        logger(`An error occurred while retrieving data from the sensors table of values. filename: ${__dirname}.\r\nError: ${exc}`);
        return exc;
    }
}
