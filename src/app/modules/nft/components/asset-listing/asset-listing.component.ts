import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';
@Component({
    providers: [],
    selector: 'app-nft-asset-listing',
    templateUrl: './asset-listing.component.html',
    styleUrls: ['./asset-listing.component.scss']
  })
  export class NftAssetListingComponent implements OnInit {
    @Input() listings: any;
    @Input() address: string;


    constructor(private utilServ: UtilService) {}
    ngOnInit() {
  
      
    }

    isOwner(listing) {
      const seller = this.utilServ.exgToFabAddress(listing.maker);
      return seller == this.address;
    }

    addressDisplay(address: string) {
      return this.utilServ.addressDisplay(address);
    }

    displayCoinName(coinType: number) {
      return this.utilServ.getCoinNameByTypeId(coinType);
    }
  }
