import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import BigNumber from 'bignumber.js/bignumber';


@Component({
    providers: [],
    selector: 'app-nft-asset-sell-summary-listing',
    templateUrl: './asset-sell-summary-listing.component.html',
    styleUrls: ['./asset-sell-summary-listing.component.scss']
  })
  export class NftAssetSellSummaryListingComponent implements OnInit {
    @Output() postListing = new EventEmitter();
    @Input() coin: string;
    @Input() price: number;
    @Input() quantity: number;    
    constructor(
      
      private router: Router
      ) {

    }
    ngOnInit() {
            
    }

    getTotal() {
      if(this.price && this.quantity) {
        return new BigNumber(this.price).multipliedBy(new BigNumber(this.quantity)).toNumber();
      }
      return '';
    }
    postListingDo() {
      this.postListing.emit();
    }
  }
