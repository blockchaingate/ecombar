import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NftOrder } from '../../models/nft-order';

@Component({
    providers: [],
    selector: 'app-nft-asset-info',
    templateUrl: './asset-info.component.html',
    styleUrls: ['./asset-info.component.scss']
  })
  export class NftAssetInfoComponent implements OnInit {
    @Input() asset: any;
    @Input() collection: any;
    @Input() owner: string;
    @Input() address: string;
    sellOrder: NftOrder;
    constructor(private utilServ: UtilService) {}
    ngOnInit() {
      if(this.asset) {
        if(this.asset.orders && this.asset.orders.length > 0) {
          const sellOrders = this.asset.orders.filter(item => item.side == 1);
          
          if(sellOrders && sellOrders.length > 0) {
            this.sellOrder = NftOrder.from(sellOrders[sellOrders.length - 1]);

            console.log('this.sellOrder=', this.sellOrder);
          }
          
        }        
      }         
    }

    getCoinName(coinType: number) {
      return this.utilServ.getCoinNameByTypeId(coinType);
    }
  }
