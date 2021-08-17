import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/modules/shared//services/util.service';
import { NftOrderService } from '../../services/nft-order.service';

@Component({
    providers: [],
    selector: 'app-nft-account-offers-table',
    templateUrl: './account-offers-table.component.html',
    styleUrls: ['./account-offers-table.component.scss']
  })
  export class NftAccountOffersTableComponent implements OnInit {
    offers: any;
    @Input() address: string;
    constructor(
      private utilServ: UtilService,
      private orderServ: NftOrderService) {}
    ngOnInit() {
      this.orderServ.getOffersByAddress(this.address).subscribe(
        (ret: any) => {
          console.log('rettttt=', ret);
          if(ret && ret.ok) {
            this.offers = ret._body;
          }
        }
      );
    }

    getCoinName(coinType) {
      return this.utilServ.getCoinNameByTypeId(coinType);
    }

    addressDisplay(address: string) {
      return this.utilServ.addressDisplay(address);
    }    

    getStatus(status: number) {
      if(status == -1) {
        return 'Cancelled';
      } else
      if(status == 1) {
        return 'Matched';
      }
      return 'Valid';
      //-1: cancel; 0: normal; 1: matched
    }
  }