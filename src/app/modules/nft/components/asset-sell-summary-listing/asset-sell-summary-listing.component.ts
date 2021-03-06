import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    providers: [],
    selector: 'app-nft-asset-sell-summary-listing',
    templateUrl: './asset-sell-summary-listing.component.html',
    styleUrls: ['./asset-sell-summary-listing.component.scss']
  })
  export class NftAssetSellSummaryListingComponent implements OnInit {
    @Output() postListing = new EventEmitter();
    @Input() coin: string;
    @Input() quantity: number;    
    constructor(
      
      private router: Router
      ) {

    }
    ngOnInit() {
            
    }

    postListingDo() {
      this.postListing.emit();
    }
  }
