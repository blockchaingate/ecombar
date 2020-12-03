import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from '../../../../../shared/services/util.service';
import { KanbanService } from '../../../../../shared/services/kanban.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

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
  currentCoin: string;
  currentCoinAddress: string;
  walletAddress: string;
  kanbanAddress: string;
  walletBalance: number;
  assets: any;
  walletValue: number;
  gas: any;
  currentTab: string;
  
   constructor(
      private localSt: LocalStorage,
      public utilServ: UtilService,
      public ngxSmartModalService: NgxSmartModalService,
      private kanbanServ: KanbanService,
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {
      this.gas = 0;
      this.currentTab = 'wallet';
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
    
    changeTab(tabName: string) {
      this.currentTab = tabName;
    }

    onChange(value) {
      console.log('value==', value);
      this.wallet = this.wallets.items.filter(item => (item.id == value))[0];
      console.log('this.wallet=', this.wallet);
      this.loadWallet();
    }

    getCurrentCoinAddress() {
      const addresses = this.wallet.addresses;
      console.log('addresses==', addresses);
      let fabAddress = '';
      let ethAddress = '';
      for(let i = 0; i < addresses.length; i ++) {
        const addr = addresses[i];
        if(addr.name == this.currentCoin) {
          return addr.address;
        }
        if(addr.name == 'FAB') {
          fabAddress = addr.address;
        }
        if(addr.name == 'ETH') {
          ethAddress = addr.address;
        }
      }

      if(this.currentCoin == 'EXG' || this.currentCoin == 'DUSD') {
        return fabAddress;
      } 
      return ethAddress;
    }

    loadWallet() {
      const addresses = this.wallet.addresses;
      const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
      this.walletAddress = walletAddressItem.address;
      this.kanbanAddress = this.utilServ.fabToExgAddress(this.walletAddress);
      this.refreshGas();
      this.refreshAssets();
      this.kanbanServ.getWalletBalances(addresses).subscribe(
        (res: any) => {
          console.log('res for getWalletBalances=', res);
          if(res && res.success) {
            this.coins = res.data.filter(item => ((item.coin != 'CAD') && (item.coin != 'RMB')));
            const exgCoin = this.coins.filter(item => item.coin == 'EXG')[0];
            console.log('exgCoin==', exgCoin);
            this.currentCoin = exgCoin.coin;
            this.currentCoinAddress = this.getCurrentCoinAddress();
            this.walletBalance = Number(exgCoin.balance) + Number(exgCoin.lockBalance);
            this.walletValue = this.walletBalance * exgCoin.usdValue.USD;
          }
        }
      );
    }

    refreshAssets() {
      this.kanbanServ.getExchangeBalance(this.kanbanAddress).subscribe(
        (resp: any) => {
            this.assets = resp;
            console.log('this.assets=', this.assets);
        },
        error => {
            // console.log('errorrrr=', error);
        }
    );
    }

    refreshGas() {

      this.kanbanServ.getKanbanBalance(this.kanbanAddress).subscribe(
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