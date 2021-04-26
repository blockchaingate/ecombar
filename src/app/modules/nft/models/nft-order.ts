const nullAddress = '0x0000000000000000000000000000000000000000';
const nullBytes = '0x00';
const nullBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
import BigNumber from 'bignumber.js/bignumber';

export class NftOrder {
    hash: string;
    hashForSignature: string;
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
    
    getExchange() {
      return this.exchange ?? nullAddress;
    }
    getMaker() {
      return this.maker ?? nullAddress;
    }
    getTaker() {
      return this.taker  ?? nullAddress;
    }
    getMakerRelayerFee() {
      return this.makerRelayerFee;
    }
    getTakerRelayerFee() {
      return this.takerRelayerFee;
    }
    getMakerProtocolFee() {
      return this.makerProtocolFee;
    }
    getTakerProtocolFee() {
      return this.takerProtocolFee;
    }
    getFeeRecipient() {
      return this.feeRecipient ?? nullAddress;
    }
    getFeeMethod() {
      return this.feeMethod;
    }
    getSide() {
      return this.side;
    }
    getSaleKind() {
      return this.saleKind;
    }
    getTarget() {
      return this.target ?? nullAddress;
    }
    getHowToCall() {
      return this.howToCall;
    }
    getCalldata() {
      return this.calldata;
    } 
    getReplacementPattern() {
      return this.replacementPattern;
    }
    getStaticTarget() {
      return this.staticTarget ?? nullAddress;
    }
    getStaticExtradata() {
      return this.staticExtradata ?? nullBytes;
    }
    getCoinType() {
      return this.coinType;
    }
    getBasePrice() {
      return new BigNumber(this.basePrice).multipliedBy(new BigNumber(1e18)).toFixed();
    }
    getExtra() {
      return this.extra;
    }
    getListingTime() {
      return this.listingTime;
    }
    getExpirationTime() {
      return this.expirationTime;
    }
    getSalt() {
      return this.salt;
    }
    getR() {
      return this.r;
    }
    getS() {
      return this.s;
    }
    getV() {
      return this.v;
    } 
    getHash() {
      return this.hash;
    }

    public clone() {
      return new NftOrder(
        this.exchange,
        this.maker,
        this.taker,
        this.makerRelayerFee,
        this.takerRelayerFee,
        this.makerProtocolFee,
        this.takerProtocolFee,
        this.feeRecipient,
        this.feeMethod,
        this.side,
        this.saleKind,
        this.target,
        this.howToCall,
        this.calldata,
        this.replacementPattern,
        this.staticTarget,
        this.staticExtradata,
        this.coinType,
        this.basePrice,
        this.extra,
        this.listingTime,
        this.expirationTime,
        this.salt,
        this.r,
        this.s,
        this.v       
      );
    }

    public static from(json) {
      const order = new NftOrder(json.exchange, 
        json.maker, 
        json.taker,
        json.makerRelayerFee,
        json.takerRelayerFee,
        json.makerProtocolFee,
        json.takerProtocolFee,
        json.feeRecipient,
        json.feeMethod,
        json.side,
        json.saleKind,
        json.target,
        json.howToCall,
        json.calldata,
        json.replacementPattern,
        json.staticTarget,
        json.staticExtradata,
        json.coinType,
        json.basePrice,
        json.extra,
        json.listingTime,
        json.expirationTime,
        json.salt,
        json.r,
        json.s,
        json.v);
      order.hash = json.hash;
      order.hashForSignature = json.hashForSignature;
      return order;
    }
    public toString() {
      return {
        hash: this.hash,
        hashForSignature: this.hashForSignature,
        exchange: this.getExchange(),
        maker: this.getMaker(),
        taker: this.getTaker(),
        makerRelayerFee: this.getMakerRelayerFee(),
        takerRelayerFee: this.getTakerRelayerFee(),
        makerProtocolFee: this.getMakerProtocolFee(),
        takerProtocolFee: this.getTakerProtocolFee(),
        feeRecipient: this.getFeeRecipient(),
        feeMethod: this.getFeeMethod(),
        side: this.getSide(),
        saleKind: this.getSaleKind(),
        target: this.getTarget(),
        howToCall: this.getHowToCall(),
        calldata: this.getCalldata(),
        replacementPattern: this.getReplacementPattern(),
        staticTarget: this.getStaticTarget(),
        staticExtradata: this.getStaticExtradata(),
        coinType: this.getCoinType(),
        basePrice: this.getBasePrice(),
        extra: this.getExtra(),
        listingTime: this.getListingTime(),
        expirationTime: this.getExpirationTime(),
        salt: this.getSalt(),
        r: this.getR(),
        s: this.getS(),
        v: this.getV()
      };
    }
}
