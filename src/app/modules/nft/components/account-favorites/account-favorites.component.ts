import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NftFavoriteService } from '../../services/nft-favorite.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
    providers: [],
    selector: 'app-nft-account-favorites',
    templateUrl: './account-favorites.component.html',
    styleUrls: ['./account-favorites.component.scss']
  })
  export class NftAccountFavoritesComponent implements OnInit {
    @Input() address;
    wallet: any;
    assets: any;
    options = {
        expanded: true
    }   
    
    myfavorites: any;
    selectedCollections = [];
    selectedCurrencies = [];
    constructor(private localSt: LocalStorage,private favoriteServ: NftFavoriteService) {}
    ngOnInit() {
      if(this.address) {
        this.favoriteServ.getByAddress(this.address).subscribe(
          (ret: any) => {
            if(ret && ret.ok) {
              this.assets = ret._body;
              console.log('this.assets=', this.assets);
            }
          }
        );

        this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

          if(!wallets || !wallets.items || (wallets.items.length == 0)) {
            return;
          }
          const wallet = wallets.items[wallets.currentIndex];
          this.wallet = wallet;
  
          const addresses = wallet.addresses;
          const address = addresses.filter(item => item.name == 'FAB')[0].address;
          
          this.favoriteServ.getByAddress(address).subscribe(
            (ret: any) => {
              if(ret && ret.ok) {
                this.myfavorites = ret._body;
              }
            }
          );      
  
        });

      } else {
        this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

          if(!wallets || !wallets.items || (wallets.items.length == 0)) {
            return;
          }
          const wallet = wallets.items[wallets.currentIndex];
          this.wallet = wallet;
  
          const addresses = wallet.addresses;
          const address = addresses.filter(item => item.name == 'FAB')[0].address;
          
          this.favoriteServ.getByAddress(address).subscribe(
            (ret: any) => {
              if(ret && ret.ok) {
                this.myfavorites = ret._body;
                this.assets = ret._body;
              }
            }
          );      
  
        });       
      }



    }
  }