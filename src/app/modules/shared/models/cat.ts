import { TextLan } from './textlan';

export interface Cat {
    _id?: number;
    parentId?: number;
    cat?: string;
    catLan?: TextLan;
    typ?: string;
    seq?: number
}