
import { Coin } from './coin';
import { Address } from './address';

export class MyCoin extends Coin {
    balance: number;
    lockedBalance: number;
    lockers: any;
    receiveAdds: Address[];
    changeAdds: Address[];
    tokenType: string;
    baseCoin: MyCoin;
    override decimals: number;  // Fix: error TS4114: This member must have an 'override' modifier because it overrides a member in the base class 'Coin'.
    usdPrice: number;
    redeposit: any[];
    depositErr: any[];
    contractAddr: string;

    constructor(name: string) {
        super(name);
        this.balance = 0;
        this.usdPrice = 0;
        this.lockedBalance = 0;
        this.tokenType = '';
        this.contractAddr = '';
        this.receiveAdds = new Array();
        this.changeAdds = new Array();
        this.baseCoin = null;
    }

}
