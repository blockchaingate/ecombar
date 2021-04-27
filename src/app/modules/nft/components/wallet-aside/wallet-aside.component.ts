import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
@Component({
    providers: [],
    selector: 'app-wallet-aside',
    templateUrl: './wallet-aside.component.html',
    styleUrls: ['./wallet-aside.component.scss']
  })
  export class NftWalletAsideComponent implements OnInit {
      wallet: any;
      wallets: any;
      address: string;

      constructor(private route: Router, private localSt: LocalStorage) {}
      ngOnInit() {
          console.log('fafeaw');
        this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {
            console.log('wallets=', wallets);
            if(!wallets || !wallets.items || (wallets.items.length == 0)) {
              return;
            }
            this.wallets = wallets;
            const wallet = wallets.items[wallets.currentIndex];
            console.log('wallet===', wallet);
            this.wallet = wallet;
            const addresses = wallet.addresses;
            this.address = addresses.filter(item => item.name == 'FAB')[0].address;
        });           
      }

      changeWallet(walltId: string) {
          this.wallet = this.wallets.items.filter(item => item.id == walltId)[0];
          const addresses = this.wallet.addresses;
          this.address = addresses.filter(item => item.name == 'FAB')[0].address;          
      } 
      
      createWallet() {
        this.route.navigate(['/admin/create-wallet']);
      }
  
      restoreWallet() {
        this.route.navigate(['/admin/import-wallet']);
      }      
  }
