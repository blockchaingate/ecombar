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
  walletAddress: string;
  walletBalance: number;
  walletValue: number;
  gas: any;
  
   constructor(
      private localSt: LocalStorage,
      public utilServ: UtilService,
      private kanbanServ: KanbanService,
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {
      this.gas = 0;
      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

        if(!wallets || (wallets.length == 0)) {
          return;
        }
        this.wallets = wallets;
        console.log('this.wallets==', this.wallets);
        this.wallet = this.wallets.items[this.wallets.currentIndex];
        
        this.loadWallet();

      });
    }
    
    onChange(value) {
      console.log('value==', value);
      this.wallet = this.wallets.items.filter(item => (item.id == value))[0];
      console.log('this.wallet=', this.wallet);
      this.loadWallet();
    }

    loadWallet() {
      const addresses = this.wallet.addresses;
      const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
      this.walletAddress = walletAddressItem.address;
      this.kanbanServ.getWalletBalances(addresses).subscribe(
        (res: any) => {
          console.log('res for getWalletBalances=', res);
          if(res && res.success) {
            this.coins = res.data.filter(item => ((item.coin != 'CAD') && (item.coin != 'RMB')));
            const exgCoin = this.coins.filter(item => item.coin == 'EXG')[0];
            this.walletBalance = Number(exgCoin.balance) + Number(exgCoin.lockBalance);
            this.walletValue = this.walletBalance * exgCoin.usdValue.USD;
            console.log('exgCoin=', exgCoin);
          }
        }
      );
    }

    refreshGas() {
      this.kanbanServ.getKanbanBalance(this.wallet.excoin.receiveAdds[0].address).subscribe(
          (resp: any) => {
              // console.log('resp=', resp);
              const fab = this.utilServ.stripHexPrefix(resp.balance.FAB);
              this.gas = this.utilServ.hexToDec(fab) / 1e18;

          },
          error => {
              // console.log('errorrrr=', error);
          }
      );
  }

    deposit(coin) {

    }
}