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
    @Input() asset: any;
    constructor(private utilServ: UtilService, private coinServ: CoinService) {}
    ngOnInit() {
          
    }

    getCoinName(coinType: number) {
      return this.coinServ.getCoinNameByTypeId(coinType);
    }

    getIcon(event: string) {
      return 'local_offer';
    }
    addressDisplay(address: string) {
      if(!address) {
        return '';
      }

      if(address.indexOf('0x') === 0) {
        address = this.utilServ.exgToFabAddress(address);
      }
      return address.substring(0,3) + '...' + address.substring(address.length - 3);
    }
}
