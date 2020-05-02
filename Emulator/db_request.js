// @ts-check
'use strict';

const { ConnectionPool } = require('mssql');
const { db_config, logger } = require('../config');
/**
* @param {string} requestString Request string
* @returns {Promise<object>} Result of the request
*/
module.exports = async requestString => {
   try {
      const connectionPool = new ConnectionPool(db_config);
      const pool = await connectionPool.connect();
      const data = await pool.query(requestString);
      pool.close();
      return data;
   }
   catch (exc) {
      logger(`file: ${__dirname} function: makeRequest`, exc);
      return exc;
   }
};