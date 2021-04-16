import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NftPortService } from '../../services/nft-port.service';

@Component({
    providers: [],
    selector: 'app-nft-asset-sell-summary-listing',
    templateUrl: './asset-sell-summary-listing.component.html',
    styleUrls: ['./asset-sell-summary-listing.component.scss']
  })
  export class NftAssetSellSummaryListingComponent implements OnInit {
    constructor(
      private nftPortServ: NftPortService,
      private router: Router
      ) {

    }
    ngOnInit() {
            
    }

    postListing() {
      this.nftPortServ.createSellOrder();
    }
  }
