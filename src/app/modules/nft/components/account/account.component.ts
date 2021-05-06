import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
    providers: [],
    selector: 'app-nft-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
  })
  export class NftAccountComponent implements OnInit {
    address: string;
    wallet: any;
    constructor(
      private localSt: LocalStorage,
      private route: ActivatedRoute) {}
    ngOnInit() {
      this.route.paramMap.subscribe((params: ParamMap) =>  {
        this.address = params.get('address');   
        if(!this.address) {
          this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

            if(!wallets || !wallets.items || (wallets.items.length == 0)) {
              return;
            }
            const wallet = wallets.items[wallets.currentIndex];
            this.wallet = wallet;
            const addresses = wallet.addresses;
            this.address = addresses.filter(item => item.name == 'FAB')[0].address;
          });           
        }
      });          
    }

  }
