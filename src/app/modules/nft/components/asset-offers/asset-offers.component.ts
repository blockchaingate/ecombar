import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-asset-offers',
    templateUrl: './asset-offers.component.html',
    styleUrls: ['./asset-offers.component.scss']
  })
  export class NftAssetOffersComponent implements OnInit {
    @Input() offers: any;
    ngOnInit() {
          
    }

  }
