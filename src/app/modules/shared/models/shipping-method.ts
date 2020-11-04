import { TextLan } from './textlan';
import { Carrier } from './carrier';

export interface ShippingMethod {
    _id?: string;
    code?: string;
    carrier?: Carrier;
    shippingMethod?: string;
    type?: string;
    days?: number;
    sizeLimit?: number; // L x W x H (mm3)
    weightLimit?: number; // gram
    lenghthLimit: number; // mm
}