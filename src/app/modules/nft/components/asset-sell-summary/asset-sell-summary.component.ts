import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NftPortService } from '../../services/nft-port.service';

@Component({
    providers: [],
    selector: 'app-nft-asset-sell-summary',
    templateUrl: './asset-sell-summary.component.html',
    styleUrls: ['./asset-sell-summary.component.scss']
  })
  export class NftAssetSellSummaryComponent implements OnInit {
    @Input() asset: any;
    @Input() coin: string;
    @Input() quantity: number;
    @Output() postListing = new EventEmitter();
    constructor(private nftPortServ: NftPortService,) {

    }
    ngOnInit() {
          
    }

    postList() {
      this.postListing.emit();
      //
    }
  }
