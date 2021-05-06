import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NftAssetService } from '../../services/nft-asset.service';

@Component({
    providers: [],
    selector: 'app-nft-account-in-wallet-assets',
    templateUrl: './account-in-wallet-assets.component.html',
    styleUrls: ['./account-in-wallet-assets.component.scss']
  })
  export class NftAccountInWalletAssetsComponent implements OnInit {
    assets: any;
    constructor(private assetServ: NftAssetService) {}
    
    ngOnInit() {
      this.assetServ.getAll().subscribe(
        (ret: any) => {
          if(ret && ret.ok) {
            this.assets = ret._body;
          }
        }
      );      
    }

  }
