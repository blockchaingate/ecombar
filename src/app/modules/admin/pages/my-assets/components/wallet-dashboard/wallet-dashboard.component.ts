import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-admin-wallet-dashboard',
  providers: [],
  templateUrl: './wallet-dashboard.component.html',
  styleUrls: ['./wallet-dashboard.component.scss']
})
export class WalletDashboardComponent implements OnInit{
  coins: any;
  noWallet: boolean;
   constructor(
      private localSt: LocalStorage,
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {
      this.noWallet = true;
      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {
        console.log('wallets=', wallets);
        if(!wallets || (wallets.length == 0)) {
          return;
        }
        
        this.noWallet = false;
        console.log('this.noWallet2=', this.noWallet);
      });
    }
    
    deposit(coin) {

    }
}