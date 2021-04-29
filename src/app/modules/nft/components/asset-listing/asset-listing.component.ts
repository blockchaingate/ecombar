import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-asset-listing',
    templateUrl: './asset-listing.component.html',
    styleUrls: ['./asset-listing.component.scss']
  })
  export class NftAssetListingComponent implements OnInit {
    @Input() listings: any;
    ngOnInit() {
          
    }

  }
