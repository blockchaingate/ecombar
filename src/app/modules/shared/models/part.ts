import {NameValue} from './name-value';

export interface Part {
    _id?: string;
    code?: string;
    sn?: string;
    pn?: string;
    specs?: [NameValue];
    material: string;
    weight: number; // gram
    length: number; // mm
    width: number; // mm
    height: number; // mm
    manufacturerMerchantId?: string;
    note: string;
}