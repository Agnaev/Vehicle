// @ts-check

'use strict'

const {ConnectionPool}      = require('mssql');
const {db_config, logger}   = require('../../config');

/**@typedef {{user:string, password:string, server:string, database:string}} db_config */

/**
 * @param {db_config} config 
 * @returns {(requestString:string) => Promise<any>} функция которая может делать запросы к базе данных
 */
const connectToDatabase = config => {
    return async requestString => {
        try{
            const connectionPool = new ConnectionPool(config)
            const pool = await connectionPool.connect()
            const data = await pool.query(requestString)
            pool.close()
            return data
        }
        catch(exc){
            logger(`file: ${__dirname} function: connect(nested function), request stirng: ${requestString}`, exc)
            return exc
        }
    }
}

const DatabaseCheck = async () => {
    try {
        console.log('Database check...')
        let makeRequest = connectToDatabase({
            ...db_config,
            database: 'master'
        });
        const requestResult = await makeRequest(`
            SELECT DB_ID('${ db_config.database}') as db_id
        `);
        if(!requestResult.recordset[0]['db_id']){
            console.log('database is not exist\r\nCreating database...');
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
            console.log('Database was created');
        }
    }
    catch(exc) {
        logger(`Error while database checking; file: ${__dirname}`, exc);
        return exc;
    }
}

module.exports = {
    makeRequest: connectToDatabase(db_config),
    DatabaseCheck
};