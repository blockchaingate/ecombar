import { TextLan } from './textlan';
import { QuantityPrice } from './qty-price';
import { MemberPrice} from './member-price';
import { NameValue} from './name-value';
import { ShippingMethod} from './shipping-method';
import { Accessory } from './accessory';
import { Image } from './image';

export interface Inventory {
    _id: string;
    sku: string;
    productId: string;
    warehouseId: string;
    merchantId: string;
    primaryCategoryId: string;
    secondaryCategoryId: string;
    shortName: string;
    
    quantity: number;
    
    weightGram: number;
    lengthMM: number;
    widthMM: number;
    depthMM: number;
    
    size: string;
    sizeCode: string;
    
    keywords: string;
    
    withBattery: boolean;
    pureBattery: boolean;
    fragile: boolean;
    gas: boolean;
    liquid: boolean;
    powder: boolean;
    flammable: boolean;
    hazardous: boolean;
    weapon: boolean;
    animal: boolean;
    food: boolean;
    precious: boolean;
    
    imageThumbnail: string;
    imageGallery: string;
    images: [Image],
    
    contents: [Accessory],
    variations: [NameValue],
    
    currencyCode: string;
    cost: number;
    msrp: number;
    marketPrice: number;
    retailPrice: number;
    startPrice: number;
    reservePrice: number;
    binPrice: number;
    fixPrice: number;
    shippingOptions: [ShippingMethod],
    handlingPrice: number;
    
    wholesalePrice: [QuantityPrice];
    
    resalePermit: string;
    memberPrice: [MemberPrice],
    
    returnDays: number;
    warrantyDays: number;
    
    boxCode: string;
    
    policies: TextLan,
    
    hot: number;
    
    publicView: boolean;
    
    lastUpdated: Date;
    dateCreated: Date;
}