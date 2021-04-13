import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    providers: [],
    selector: 'app-nft-asset-sell-summary-listing',
    templateUrl: './asset-sell-summary-listing.component.html',
    styleUrls: ['./asset-sell-summary-listing.component.scss']
  })
  export class NftAssetSellSummaryListingComponent implements OnInit {
    constructor(private router: Router) {

    }
    ngOnInit() {
            
    }

    postListing() {
      this.router.navigate(['/nft/asset']);
    }
  }