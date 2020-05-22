export declare type db_item = {
    Id: number;
    Name: string;
    Description: string;
    MinValue: number;
    MaxValue: number;
};
export declare type response_type = {
    [key: number]: number;
};
export declare type generator_type = {
    data: response_type;
    init?: true;
};
export declare const generator: (...args: any[]) => any;
//# sourceMappingURL=data_generator.d.ts.map