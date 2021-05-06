import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NftCollectionService } from '../../services/nft-collection.service';

@Component({
    providers: [],
    selector: 'app-nft-account-in-wallet-currency',
    templateUrl: './account-in-wallet-currency.component.html',
    styleUrls: ['./account-in-wallet-currency.component.scss']
  })
  export class NftAccountInWalletCurrencyComponent implements OnInit {
    acceptableCoins: any;

    constructor(private utilServ: UtilService) {}
    ngOnInit() {
        this.acceptableCoins = this.utilServ.getAcceptableCoins();
    }
  }