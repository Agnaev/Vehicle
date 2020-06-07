export interface SensorsStateType {
    Id: number;
    SensorTypeId: number;
    StateId: number;
    MinValue: number;
    MaxValue: number;
}
export declare const get: () => Promise<any>;
export declare const getById: (Id: number) => Promise<any>;
export declare const states_list: () => Promise<any>;
export declare const update: ({ Id, SensorTypeId, StateId, MinValue, MaxValue }: SensorsStateType) => Promise<boolean>;
export declare const create: ({ SensorTypeId, StateId, MinValue, MaxValue }: SensorsStateType) => Promise<any>;
export declare const deleteState: ({ Id }: SensorsStateType) => Promise<boolean>;
//# sourceMappingURL=states.d.ts.map