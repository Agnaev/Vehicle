import { ConnectionPool, IResult } from 'mssql';
import * as config from '../../config';
/**
* @param {string} requestString Request string
* @returns {Promise<object>} Result of the request
*/
export const makeRequest = async (requestString:string):Promise<IResult<any> | Error> => {
   try {
      const connectionPool = new ConnectionPool(config.default.db_config);
      const pool = await connectionPool.connect();
      const data = await pool.query(requestString);
      pool.close();
      return data;
   }
   catch (exc) {
      config.default.logger(`file: ${__dirname} function: makeRequest`, exc);
      return exc;
   }
};