import { Component, OnInit, Input } from '@angular/core';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
    providers: [],
    selector: 'app-nft-asset-events',
    templateUrl: './asset-events.component.html',
    styleUrls: ['./asset-events.component.scss']
})
export class NftAssetEventsComponent implements OnInit {
    @Input() events: any;
    constructor(private utilServ: UtilService, private coinServ: CoinService) {}
    ngOnInit() {
          
    }

    getCoinName(coinType: number) {
      return this.coinServ.getCoinNameByTypeId(coinType);
    }

    getIcon(event: string) {
      if(event == 'Sale') {
        return 'shopping_cart';
      } else 
      if(event == 'Transfer') {
        return 'swap_horiz';
      }
      return 'local_offer';
    }
    addressDisplay(address: string) {
      return this.utilServ.addressDisplay(address);
    }
}
