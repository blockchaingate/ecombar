import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-asset-details',
    templateUrl: './asset-details.component.html',
    styleUrls: ['./asset-details.component.scss']
  })
  export class NftAssetDetailsComponent implements OnInit {
    @Input() asset: any;
    @Input() collection: any;
    @Input() address: string;
    @Input() smartContractAddress: string;
    @Input() tokenId: string;
    ngOnInit() {
          
    }

    showId(tokenId) {
      return parseInt(tokenId, 16);
    }
  }
