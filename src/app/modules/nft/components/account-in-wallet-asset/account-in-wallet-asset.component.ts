import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-account-in-wallet-asset',
    templateUrl: './account-in-wallet-asset.component.html',
    styleUrls: ['./account-in-wallet-asset.component.scss']
  })
  export class NftAccountInWalletAssetComponent implements OnInit {
    @Input() asset: any;
    
    ngOnInit() {
          
    }

  }
