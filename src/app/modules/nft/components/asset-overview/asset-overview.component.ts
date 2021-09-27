import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-asset-overview',
    templateUrl: './asset-overview.component.html',
    styleUrls: ['./asset-overview.component.scss']
  })
  export class NftAssetOverviewComponent implements OnInit {
    @Input()  asset: any;
    @Input() balance: number;
    @Input() collection: any;
    ngOnInit() {
          
    }

  }
