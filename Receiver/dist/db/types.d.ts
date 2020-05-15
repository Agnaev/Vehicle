export declare type db_item = {
    Id: number;
    Name: string;
    MinValue: number;
    MaxValue: number;
    Description: string;
};
export declare function GetMetrics(): Promise<Array<any>>;
export declare function Create(item: db_item): Promise<string>;
export declare function Update(item: db_item): Promise<void>;
export declare function Delete(item: db_item): Promise<any>;
//# sourceMappingURL=types.d.ts.map