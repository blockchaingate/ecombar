import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
    providers: [],
    selector: 'app-nft-asset-sell-price',
    templateUrl: './asset-sell-price.component.html',
    styleUrls: ['./asset-sell-price.component.scss']
  })
  export class NftAssetSellPriceComponent implements OnInit {
    selectedCoin: string;
    showPopup: boolean;
    price: number;
    @Input() noText: boolean;
    @Output() updateEntity = new EventEmitter<any>();

    constructor(private utilServ: UtilService) {

    }
    acceptableCoins: any;
    
    ngOnInit() {
      this.acceptableCoins = this.utilServ.getAcceptableCoins();
      console.log('this.acceptableCoins====', this.acceptableCoins);
      this.showPopup = false;
      this.selectedCoin = 'DUSD';  
    }

    emitEntity() {
      this.updateEntity.emit(
        {
          coin: this.selectedCoin,
          price: this.price
        }
      );
    }

    select(coin: string) {
      this.selectedCoin = coin;
      this.showPopup = false;
      this.emitEntity()
    }

  }
