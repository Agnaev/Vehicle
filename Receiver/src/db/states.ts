import { makeRequest } from "./db_connection";
import config from '../config';
import { IResult } from 'mssql';

const { logger } = config;

export interface MetricStateType {
    Id: number,
    MetricTypeId: number,
    StateId: number,
    MinValue: number,
    MaxValue: number
}

export const get = async (): Promise<any> => {
    const {
        recordsets: [
            requestResult
        ]
    } = await makeRequest(`SELECT * FROM MetricsStates`);
    return requestResult;
}

export const states_list = async (): Promise<any> => {
    const {
        recordsets: [
            requestResult
        ]
    } = await makeRequest('SELECT * FROM States');
    return requestResult;
}

export const update = async ({ Id, MetricTypeId, StateId, MinValue, MaxValue }: MetricStateType): Promise<boolean> => {
    try {
        const {
            recordsets: [
                [
                    requestResult
                ]
            ]
        } = await makeRequest(`
            UPDATE MetricsStates
            SET MetricTypeId = '${MetricTypeId}',
            StateId = '${StateId}',
            MaxValue = '${MaxValue}',
            MinValue = '${MinValue}'
            WHERE id = '${Id}'
        `);
        return true
    }
    catch (exc) {
        logger(`Произошла ошибка при обновлении состояния в базе данных. File: ${__dirname}. Error: ${exc}`)
        return false;
    }
};

export const create = async ({ MetricTypeId, StateId, MinValue, MaxValue }: MetricStateType): Promise<any> => {
    try {
        const {
            recordsets: [
                [
                    requestResult
                ]
            ]
        } = await makeRequest(`
            INSERT INTO MetricsStates (MetricTypeId, StateId, MinValue, MaxValue)
            OUTPUT inserted.Id
            values ('${MetricTypeId}', '${StateId}', '${MinValue}', '${MaxValue}')
        `);
        const result = await makeRequest(`
            SELECT *
            FROM MetricsStates
            WHERE Id=${requestResult.Id}
        `)
        return result.recordsets[0][0]; 
    }
    catch (exc) {
        logger(`Произошла ошибка при создании состояния метрики. File: ${__dirname}. Error: ${exc}`);
        return false;
    }
}

export const deleteState = async ({ Id }: MetricStateType): Promise<boolean> => {
    try {
        await makeRequest(`
            DELETE FROM MetricsStates WHERE Id=${Id}
        `);
        return true;
    }
    catch(exc) {
        logger(`Произошла ошибка при удалении состояния метрики. File: ${__dirname}. Error: ${exc}`);
        return false;
    }
}