import { Payment } from '../models/payment';

export interface Merchant {
    _id?: string;
    num?: string;

    webId?: string;
    merchantId?: string;
    warehouseId?: string;
    buyerMemberId?: string;
    buyerMarketplaceUserId?: string;
    buyerEmail?: string;

    webClassifyID?: string;
    webOrderLineNumber?: string;

    currency?: string;
    totalSale?: number;
    totalShipping?: number;
    totalHandling?: number;
    totalTax?: number;
    totalInsurance?: number;
    discount?: number;
    discountReason?: string;
    adjustment?: number;
    adjustmentReason?: string;
    totalToPay?: number;
    totalPaid?: number;
    paymentMethod?: string;

    buyerPhone?: string;
    buyerMessage?: string;

    //shipping address?:
    name?: string;
    company?: string;
    unit?: string;
    streetNumber?: string;
    streetName?: string;
    streetName2?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
    stPhone?: string;
    stMobile?: string;
    stFax?: string;
    stEmail?: string;
    addressConfirmed?: boolean;

    lengthMM?: number;
    widthMM?: number;
    depthMM?: number;
    weightG?: number;

    shippingMethodSelected?: boolean;
    shippingServiceSelected?: string;
    shippingServiceIdSelected?: string;
    shippedTime?: Date,

    active?: boolean;

    checkoutStatus?: boolean;
    paymentStatus?: number; //0?: waiting for pay, 1?: paid already, 2?: finished, 3?: cancelled, 4?: frozened 
    shippingStatus?: number;
    completeStatus?: boolean;
    txid?: string;
    charge_id?: string;
    payment?: Payment;
    verifyStatus?: number;
    internalNote?: string;

    items?: [{
        num?: string,
        inventoryId?: string,
        productId?: string,
        thumbnailUrl?: string,
        title?: string,

        customized?: boolean,
        customizeType?: string, //2d,3d,
        customizeDesign?: [{
            url?: string,
            note?: string,
            specs?: [{ name?: string, value?: String }]
        }],

        customizeTemplate?: {
            baseImgUrl?: string;
            img?: [{ _id?: number, url?: string, x?: number, y?: number, w?: number, h?: Number }],
            txt?: [{ _id?: number, content?: string, fontFamily?: string, fontSize?: string, fontColor?: String }]
        },

        currency?: string;

        quantity?: number;
        price?: number;
        buy?: boolean;
        customizePrice?: number;

        note?: string;
        canceled?: boolean;
        locked?: boolean
    }],

    note?: string;
    locked?: boolean;

    lastUpdated?: Date,
    dateCreated?: Date
}