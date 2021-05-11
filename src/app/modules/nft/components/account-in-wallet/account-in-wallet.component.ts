import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { NftAssetService } from '../../services/nft-asset.service';
import { NftFavoriteService } from '../../services/nft-favorite.service';

@Component({
    providers: [],
    selector: 'app-nft-account-in-wallet',
    templateUrl: './account-in-wallet.component.html',
    styleUrls: ['./account-in-wallet.component.scss']
  })
  export class NftAccountInWalletComponent implements OnInit {
    options = {
        expanded: true
    }

    optionsNoBorderTop = {
        expanded: true,
        noBorderTop: true
    };
    
    wallet: any;
    address: string;
    favorites: any;
    assets: any;

    constructor(
      private localSt: LocalStorage,
      private assetServ: NftAssetService,
      private favoriteServ: NftFavoriteService) {}

    ngOnInit() {
      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

        if(!wallets || !wallets.items || (wallets.items.length == 0)) {
          return;
        }
        const wallet = wallets.items[wallets.currentIndex];
        this.wallet = wallet;
        const addresses = wallet.addresses;
        this.address = addresses.filter(item => item.name == 'FAB')[0].address;
        this.favoriteServ.getByAddress(this.address).subscribe(
          (ret: any) => {
            if(ret && ret.ok) {
              this.favorites = ret._body;
            }
          }
        );
      });  
      
      this.assetServ.getAll().subscribe(
        (ret: any) => {
          if(ret && ret.ok) {
            this.assets = ret._body;
            console.log('');
          }
        }
      );       
    }

  }
