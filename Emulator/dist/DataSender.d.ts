import { Observer, subscribe_fn } from './Observer';
import { generator_type, response_type } from './data_generator';
export default class extends Observer {
    generator: any;
    IsGeneratorWork: boolean;
    data: response_type;
    count: number;
    storage: Array<response_type>;
    constructor(data_generator: (data: generator_type) => response_type);
    subscribe(callback: subscribe_fn): () => void;
    UpdateData(): void;
    broadcast(): void;
}
//# sourceMappingURL=DataSender.d.ts.map