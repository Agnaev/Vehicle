import { IResult } from 'mssql';
export declare type db_config = {
    user: string;
    password: string;
    server: string;
    database: string;
};
export declare const DatabaseCheck: () => Promise<void>;
export declare const makeRequest: (requestString: string) => Promise<IResult<any>>;
//# sourceMappingURL=db_connection.d.ts.map