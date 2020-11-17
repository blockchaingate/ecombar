import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from '../../../../../shared/services/util.service';
import { KanbanService } from '../../../../../shared/services/kanban.service';

@Component({
  selector: 'app-admin-wallet-dashboard',
  providers: [],
  templateUrl: './wallet-dashboard.component.html',
  styleUrls: ['./wallet-dashboard.component.scss']
})
export class WalletDashboardComponent implements OnInit{
  coins: any;
  wallets: any;
  wallet: any;
   constructor(
      private localSt: LocalStorage,
      public utilServ: UtilService,
      private kanbanServ: KanbanService,
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {
      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {
        console.log('wallets=', wallets);
        if(!wallets || (wallets.length == 0)) {
          return;
        }
        this.wallets = wallets;
        this.wallet = this.wallets.items[this.wallets.currentIndex];
        const addresses = this.wallet.addresses;

        this.kanbanServ.getWalletBalances(addresses).subscribe(
          (res: any) => {
            console.log('res for getWalletBalances=', res);
            if(res && res.success) {
              this.coins = res.data;
            }
          }
        );
      });
    }
    
    deposit(coin) {

    }
}