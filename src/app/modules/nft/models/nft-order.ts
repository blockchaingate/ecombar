export class NftOrder {
    exchange: string; //address
    maker: string; //address
    taker: string; //address
    makerRelayerFee: number;
    takerRelayerFee: number;
    makerProtocolFee: number;
    takerProtocolFee: number;
    feeRecipient: string; //address
    feeMethod: number; //0: ProtocolFee, 1: SplitFee
    side: number; //0: Buy, 1: Sell
    saleKind: number; //0: FixedPrice, 1: DutchAuction
    target: string; //address
    howToCall: number; //0: Call, 1: DelegateCall
    calldata: string; 
    replacementPattern: string; 
    staticTarget: string; //address
    staticExtradata: string; 
    coinType: number;
    basePrice: number;
    extra: number;
    listingTime: number; /* Listing timestamp. */ 
    expirationTime: number; /* Expiration timestamp - 0 for no expiry. */ 
    salt: number;  /* Order salt, used to prevent duplicate hashes. */ 
    r: string;
    s: string;
    v: string;
    constructor(
        exchange: string, 
        maker: string, 
        taker: string,
        makerRelayerFee: number,
        takerRelayerFee: number,
        makerProtocolFee: number,
        takerProtocolFee: number,
        feeRecipient: string,
        feeMethod: number,
        side: number,
        saleKind: number,
        target: string,
        howToCall: number,
        calldata: string,
        replacementPattern: string,
        staticTarget: string,
        staticExtradata: string,
        coinType: number,
        basePrice: number,
        extra: number,
        listingTime: number,
        expirationTime: number,
        salt: number,
        r: string = '',
        s: string = '',
        v: string = ''
    ) {
      this.exchange = exchange;
      this.maker = maker;
      this.taker = taker;
      this.makerRelayerFee = makerRelayerFee;
      this.takerRelayerFee = takerRelayerFee;
      this.makerProtocolFee = makerProtocolFee;
      this.takerProtocolFee = takerProtocolFee;
      this.feeRecipient = feeRecipient;
      this.feeMethod = feeMethod;
      this.side = side;
      this.saleKind = saleKind;
      this.target = target;
      this.howToCall = howToCall;
      this.calldata = calldata;
      this.replacementPattern = replacementPattern;
      this.staticTarget = staticTarget;
      this.staticExtradata = staticExtradata;
      this.coinType = coinType;
      this.basePrice = basePrice;
      this.extra = extra;
      this.listingTime = listingTime;
      this.expirationTime = expirationTime;
      this.salt = salt;
      this.r = r;
      this.s = s;
      this.v = v;
    }
}
