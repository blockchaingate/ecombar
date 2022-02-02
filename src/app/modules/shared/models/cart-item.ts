export class CartItem {
    productId: string;
    objectId: string;
    title: string;
    price: number;
    giveAwayRate: number;
    taxRate: number;
    lockedDays: number;
    storeId: string;
    size?: string;
    color?: string;
    currency?: string;
    quantity: number;
    thumbnailUrl?: string;
}

export class CartItemForSmartContract {
    objectId: string;
    quantity: number;
}