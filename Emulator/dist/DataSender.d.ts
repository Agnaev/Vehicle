import { Observer } from './Observer';
declare type datatype = {
    [key: number]: number;
};
export default class extends Observer {
    generator: any;
    IsGeneratorWork: boolean;
    data: {
        [key: number]: number;
    };
    count: number;
    storage: Array<datatype>;
    constructor(data_generator: (data: datatype) => datatype);
    subscribe(callback: (data: string) => void): () => void;
    UpdateData(): void;
    broadcast(): void;
}
export {};
//# sourceMappingURL=DataSender.d.ts.map