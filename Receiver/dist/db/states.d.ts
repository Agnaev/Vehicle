export interface MetricStateType {
    Id: number;
    MetricTypeId: number;
    StateId: number;
    MinValue: number;
    MaxValue: number;
}
export declare const get: () => Promise<any>;
export declare const states_list: () => Promise<any>;
export declare const update: ({ Id, MetricTypeId, StateId, MinValue, MaxValue }: MetricStateType) => Promise<boolean>;
export declare const create: ({ MetricTypeId, StateId, MinValue, MaxValue }: MetricStateType) => Promise<any>;
export declare const deleteState: ({ Id }: MetricStateType) => Promise<boolean>;
//# sourceMappingURL=states.d.ts.map