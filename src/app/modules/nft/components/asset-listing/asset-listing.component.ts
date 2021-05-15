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
    @Input() owner: string;

    isOwner: boolean;
    constructor(private utilServ: UtilService) {}
    ngOnInit() {
      this.isOwner = false;
      if(this.owner && this.address) {
        this.isOwner = this.owner == this.address;
      }    
      
    }


    addressDisplay(address: string) {
      return this.utilServ.addressDisplay(address);
    }

    displayCoinName(coinType: number) {
      return this.utilServ.getCoinNameByTypeId(coinType);
    }
  }
