import { Component, OnInit, Input, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-asset-info',
    templateUrl: './asset-info.component.html',
    styleUrls: ['./asset-info.component.scss']
  })
  export class NftAssetInfoComponent implements OnInit {
    @Input() asset: any;
    @Input() collection: any;
    ngOnInit() {
          
    }

  }
