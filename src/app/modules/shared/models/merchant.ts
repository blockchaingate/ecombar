export interface Merchant {
    _id?: string;

    name?: string;
    nameLan?: [string];
    parentId?: string;
    //businessType: { type: String, enum: ['', 'Corperation', 'Trade company', 'Manufacturer', 'Retail', 'Store', 'Other'] },
    businessType?: string;

    createMemberId?: string;
    logoUrl?: string;
    api_key?: string;
    countryCode?: string;
    walletExgAddress?: string; //Wallet EXG address, one wallet can only have one member account.
    registryOrganization?: string;
    registryNumber?: string;
    licenseNumber?: string;
    dateRegistered?: Date;

    phone?: string;
    fax?: string;
    email?: string;
    website?: string;
    introduction?: string;
    imType?: string;
    imNumber?: string;

    addressId?: string;

    useSystemExchangeRate?: boolean;
    supplierInfoRequired?: boolean;
    productVerifyRequired?: boolean;

    merchantLevel?: number;
    memberFeePeriod?: number; //number of months
    memberFeeRate?: number;
    memberFeeCurrency?: string;
    memberFeeNexPayDate?: Date;
    transactionFeeRate?: number;
    transactionFeeMinimum?: number;
    payaplAcct?: string;

    license?: string;
    numEmployee?: number;

    verified?: boolean;
    dateVerified?: Date;
    verifierId?: string;
    verifyComment?: string;

    credit?: number;

    active?: boolean;
    approved?: boolean;

    //OTC
    otcApproved?: boolean;
    otcRating?: number;
    otcMerchantClass?: number; // 1~9.

    lastUpdated?: Date;
    dateCreated?: Date;
}
