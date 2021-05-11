import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-account-in-wallet-assets',
    templateUrl: './account-in-wallet-assets.component.html',
    styleUrls: ['./account-in-wallet-assets.component.scss']
  })
  export class NftAccountInWalletAssetsComponent implements OnInit {
    @Input() wallet: any;
    @Input() favorites: any;
    @Input() assets: any;
    @Input() address: string;

    favoriteCount: number;
    constructor() {}
    
    ngOnInit() {
      this.favoriteCount = 0;
    }

    checkFavorite(asset) {
      if(!this.favorites) {
        return false;
      }
      const tokenFavorites = this.favorites.filter(item => item.smartContractAddress == asset.smartContractAddress && item.tokenId == asset.tokenId);
      if(tokenFavorites && tokenFavorites.length > 0) {
        
        this.favoriteCount = tokenFavorites.length;
        const myFavorites = tokenFavorites.filter(item => item.address == this.address);
        if(myFavorites && myFavorites.length > 0) {
          return true;
        }
        
      }
      return false;
    }
  }
