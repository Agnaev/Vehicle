import { makeRequest } from "./db_connection";
import config from '../config';

const { logger } = config;

export interface SensorsStateType {
    Id: number,
    SensorTypeId: number,
    StateId: number,
    MinValue: number,
    MaxValue: number
}

export const get = async (): Promise<any> => {
    const {
        recordsets: [requestResult]
    } = await makeRequest(`SELECT * FROM SensorsStates`);
    return requestResult;
}

export const states_list = async (): Promise<any> => {
    const {
        recordsets: [requestResult]
    } = await makeRequest('SELECT * FROM States');
    return requestResult;
}

export const update = async ({ Id, SensorTypeId, StateId, MinValue, MaxValue }: SensorsStateType): Promise<boolean> => {
    try {
        await makeRequest(`
            UPDATE SensorsStates
            SET SensorTypeId = '${SensorTypeId}',
            StateId = '${StateId}',
            MaxValue = '${MaxValue}',
            MinValue = '${MinValue}'
            WHERE id = '${Id}'
        `);
        return true;
    }
    catch (exc) {
        logger(`Произошла ошибка при обновлении состояния в базе данных. File: ${__dirname}. Error: ${exc}`)
        return false;
    }
};

export const create = async ({ SensorTypeId, StateId, MinValue, MaxValue }: SensorsStateType): Promise<any> => {
    try {
        const {
            recordsets: [
                [requestResult]
            ]
        } = await makeRequest(`
            INSERT INTO SensorsStates (SensorTypeId, StateId, MinValue, MaxValue)
            OUTPUT inserted.Id
            values ('${SensorTypeId}', '${StateId}', '${MinValue}', '${MaxValue}')
        `);
        const {
            recordsets: [
                [result]
            ]
        } = await makeRequest(`
            SELECT *
            FROM SensorsStates
            WHERE Id=${requestResult.Id}
        `)
        return result;
    }
    catch (exc) {
        logger(`Произошла ошибка при создании состояния метрики. File: ${__dirname}. Error: ${exc}`);
        return false;
    }
}

export const deleteState = async ({ Id }: SensorsStateType): Promise<boolean> => {
    try {
        await makeRequest(`
            DELETE FROM SensorsStates WHERE Id=${Id}
        `);
        return true;
    }
    catch (exc) {
        logger(`Произошла ошибка при удалении состояния метрики. File: ${__dirname}. Error: ${exc}`);
        return false;
    }
}