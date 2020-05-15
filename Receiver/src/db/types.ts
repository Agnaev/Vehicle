// @ts-check
'use strict'
import { makeRequest } from './db_connection';
import config from '../config';

const { logger } = config;

export type db_item = {
    Id: number,
    Name: string,
    MinValue: number,
    MaxValue: number,
    Description: string
};

/** Получение всех метрик из базы данных */
export async function GetMetrics(): Promise<Array<any>> {
    try {
        const {
            recordsets: [
                types
            ]
        } = await makeRequest(`SELECT * FROM MetricsTypes`);
        return types;
    }
    catch (exc) {
        logger(`file: types; function: GetMetrics\r\nerror`, exc);
        return exc;
    }
}

/** Создание метрики в базе данных
 * @param {db_item} item 
 * @returns {Promise<string>}
*/
export async function Create(item: db_item): Promise<string> {
    try {
        const {
            recordsets: [
                [
                    requestResult
                ]
            ]
        } = await makeRequest(`
                SELECT COUNT(*) as count
                FROM MetricsTypes
                WHERE Name LIKE '${item.Name}'
            `);
        const count = requestResult.count;
        if (count > 0) {
            throw `file: ${__dirname}; function: create;\r\n Item with selected name ${item.Name} exist.`;
        }
        else if (item.MinValue > item.MaxValue) {
            throw `file: ${__dirname}; function: Create;\r\n Incorrect min and max values, min value(${item.MinValue}) greater than max value(${item.MaxValue})`;
        }
        else {
            const {
                recordsets: [
                    [
                        metricId
                    ]
                ]
            } = await makeRequest(`
                        INSERT INTO MetricsTypes([Name], [Description], [MinValue], [MaxValue]) 
                        OUTPUT inserted.Id
                        VALUES ('${item.Name}', '${item.Description}', '${item.MinValue}', '${item.MaxValue}');
                    `);
            const {
                recordsets: [
                    [
                        result
                    ]
                ]
            } = await makeRequest(`
                    SELECT * 
                    FROM MetricsTypes
                    WHERE Id = '${metricId.Id}'
                `);
            return JSON.stringify(result);
        }
    }
    catch (exc) {
        logger(`file: ${__dirname}; function: create\r\n`, exc);
        return exc;
    }
}

/**Обновление метрики
 * @param {db_item} item 
 * @returns {Promise<void>}
 * */
export async function Update(item: db_item): Promise<void> {
    makeRequest(`
            UPDATE MetricsTypes
            SET Name = '${item.Name}',
            Description = '${item.Description}',
            MaxValue = '${item.MaxValue}',
            MinValue = '${item.MinValue}'
            WHERE id = '${item.Id}'`)
        .catch(exc => {
            logger(`file: ${__dirname}; function: Update\r\nerror`, exc);
            return exc;
        })
}

/**Удаление метрики
 * @param {db_item} item 
 * @returns {Promise<void>}
*/
export async function Delete(item: db_item): Promise<any> {
    makeRequest(`DELETE FROM MetricsTypes WHERE Id = ${item.Id}`)
        .catch(exc => {
            logger(`file: ${__dirname}; function: delete\r\nerror`, exc);
            return exc;
        })
}

