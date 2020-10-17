export interface Warehouse {
    _id?: string;
    name?: string;
    code?: string;
    ownerMerchantId?: string;
    
    addressId?: string;
    address?: string;
    
    cityId?: string;
    provinceCode?: string;
    countryCode?: string;
    
    longitude?: number;
    latitude?: number;
    
    introduction?: string;
    
    pickupStart?: string;
    pickupEnd?: string;
    openTime?: string;
    closeTime?: string;
    
    printCountryNativeLan?: boolean;
    actualInventoryOnly?: boolean;
    inventoryWarning?: string;
    inventoryWarningQty?: number;
    inventoryWarrantRequired?: boolean;
    
    defaultCurrencyCode?: string;
    allowOrderMoveInForExistingInventoryOnly?: boolean;
    packageContentBarcodeVerify?: boolean;
    
    packing?: boolean;
    shipping?: boolean;
    storage?: boolean;
    dropShipping?: boolean;
    dropReceiving?: boolean;
    productSupply?: boolean;
    
    printRows?: number;
    printColumns?: number;
    printDPI?: number;
    
    thermalPrintHeightMM?: number;
    thermalPrintWidthMM?: number;
    thermalPrintDPI?: number;
    
    sizeWeightCubicCM?: number;
    
    shippingCostInput?: boolean;
    
    active?: boolean;
    lastUpdated?: Date;
    dateCreated?: Date;
}