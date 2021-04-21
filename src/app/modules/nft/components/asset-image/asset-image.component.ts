import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-asset-image',
    templateUrl: './asset-image.component.html',
    styleUrls: ['./asset-image.component.scss']
  })
  export class NftAssetImageComponent implements OnInit {
    @Input() asset;
    ngOnInit() {
          
    }

  }
