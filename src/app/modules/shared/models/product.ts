import { TextLan } from './textlan';

export interface Product {
    _id?: string;
    merchantId?: string;
    memberId?: string;
    manufacturerMerchantId?: string;

    titleId?: string;
    title?: TextLan,

    subtitleId?: string;
    subtitle?: TextLan;

    keywordsId?: string
    keywords?: TextLan;

    briefIntroductionId?: string;
    briefIntroduction?: TextLan;

    descriptionId?: string;
    description?: TextLan;

    shortName?: string;
    variations?: [{ name: TextLan, values: [string] }];

    primaryCategoryId?: string;
    secondaryCategoryId?: string;
    code?: string;
    brand?: string;
    model?: string;
    mpn?: string;
    eau?: string;
    isbn?: string;
    upc?: string;
    serialNumber?: string;

    weightGram?: number;
    lengthMM?: number;
    widthMM?: number;
    depthMM?: number;

    colors?: [string];
    size?: string;
    sizeCode?: string;

    highLights?: [TextLan];
    features?: [TextLan];
    specs?: [{ name: TextLan, values: [string] }];
    compatibleWith?: [string];
    fitFor?: [string];

    withBattery?: boolean;
    pureBattery?: boolean;
    fragile?: boolean;
    gas?: boolean;
    liquid?: boolean;
    powder?: boolean;
    flammable?: boolean;
    hazardous?: boolean;
    weapon?: boolean;
    animal?: boolean;
    food?: boolean;
    precious?: boolean;

    imageThumbnail?: string;
    imageGallery?: string;
    imageCustomize?: [string];
    images?: [string];

    contents?: [{ name: TextLan, quantity: number }],
    //variations: Array,

    currency?: string;
    price?: number; // int in cents
    cost?: number;  // int in cents
    msrp?: number;
    marketPrice?: number;
    retailPrice?: number;
    startPrice?: number;
    reservePrice?: number;
    binPrice?: number;
    fixPrice?: number;

    qtyPrices?: [{ qtyFrom: number, price: number }],

    resalePermit?: number;
    memberPrices?: [{ memberLevel: number, price: number }],

    customizable?: boolean;
    customizePrice?: number;
    customizeAdditionPrice?: number;

    customizeTemplate?: {
        baseImgUrl: string,
        img: [{ _id: number, url: string, x: number, y: number, w: number, h: number }],
        txt: [{ _id: number, x: number, y: number, content: string, fontFamily: string, fontSize: string, fontColor: string, effects: [{ name: string, values: [string] }] }]
    },

    hot?: number;
    newDate?: Date;
    special?: boolean;

    fcc?: string;
    tariff?: [string]; //Nafta ... ..
    fda?: string;
    standards?: [TextLan];

    returnDays?: number;
    warrantyDays?: number;

    boxCode?: string;
    originCountryCode?: string;

    policies?: [TextLan];

    active?: boolean;
    lastUpdated?: Date;
    dateCreated?: Date;
}