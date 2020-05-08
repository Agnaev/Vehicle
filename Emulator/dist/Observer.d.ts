declare type subscribe_fn = (key: string) => void;
export declare class Observer {
    subscribers: Array<subscribe_fn>;
    constructor();
    subscribe(callback: subscribe_fn): void;
    unsubscribe(fn: subscribe_fn): void;
    broadcast(data: string): void;
}
export {};
//# sourceMappingURL=Observer.d.ts.map