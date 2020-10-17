export interface InventoryCat {
    _id?: string;
    warehouseId?: string;
    merchantId?: string;
    code?: string,
    category?: string,
    parentId?: string;
    ancestors?: [InventoryCat];

    sequence?: number;
    thumbnailUrl?: string
}