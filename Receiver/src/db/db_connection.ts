// @ts-check

'use strict'

import { ConnectionPool, IResult } from 'mssql';
import config from '../config';

const { logger, db_config } = config;

export type db_config = {
    user: string,
    password: string,
    server: string,
    database: string
};

type config_type = {
    user: string,
    password: string,
    server: string,
    database: string
};

/**
 * @param {db_config} config 
 * @returns {(requestString:string) => Promise<any>} функция которая может делать запросы к базе данных
 */
function connectToDatabase(config: config_type): (requestString: string) => Promise<IResult<any>> {
    return async (requestString: string) => {
        try {
            const connectionPool: ConnectionPool = new ConnectionPool(config);
            const pool: ConnectionPool = await connectionPool.connect();
            const data: IResult<any> = await pool.query(requestString);
            pool.close();
            return data;
        }
        catch (exc) {
            logger(`file: ${__dirname} function: connect(nested function), request stirng: ${requestString}`, exc);
            return exc;
        }
    };
};

export const DatabaseCheck = async (): Promise<void> => {
    try {
        logger('Database check...');
        let makeRequest = connectToDatabase({
            ...db_config,
            database: 'master'
        });
        const {
            recordsets: [
                [
                    requestResult
                ]
            ]
        } = await makeRequest(`
            SELECT DB_ID('${ db_config.database}') as db_id
        `);
        if (!requestResult.db_id) {
            logger('database is not exist\r\nCreating database...');
            await makeRequest(`Create database ${db_config.database}`);
            makeRequest = connectToDatabase(db_config);
            await makeRequest(`
                CREATE TABLE MetricsTypes (
                    Id INT IDENTITY NOT NULL,
                    [Name] NVARCHAR(100) NOT NULL,
                    Description NVARCHAR(MAX),
                    MaxValue INT NOT NULL,
                    MinValue INT NOT NULL,
                    CONSTRAINT PK_MetricsTypes PRIMARY KEY (Id),
                    CONSTRAINT UQ_Type_name UNIQUE (Name)
                )
            `);
            await makeRequest(`
                CREATE TABLE MetricsValues (
                    Id INT IDENTITY NOT NULL,
                    TypeId INT NOT NULL,
                    Value INT NOT NULL,
                    CONSTRAINT PK_MetricsValuesId PRIMARY KEY(Id),
                    CONSTRAINT FK_MetricsValue_MetricsTypes FOREIGN KEY (TypeId) REFERENCES MetricsValues(Id)
                )
            `);
            logger('Database was created');
        }
    }
    catch (exc) {
        logger(`Error while database checking; file: ${__dirname}`, exc);
        return exc;
    }
};

export const makeRequest = connectToDatabase(db_config);

