import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-asset-sell-privacy',
    templateUrl: './asset-sell-privacy.component.html',
    styleUrls: ['./asset-sell-privacy.component.scss']
  })
  export class NftAssetSellPrivacyComponent implements OnInit {
    showPrivacy: boolean;
    ngOnInit() {
      this.showPrivacy = false;
    }

  }
