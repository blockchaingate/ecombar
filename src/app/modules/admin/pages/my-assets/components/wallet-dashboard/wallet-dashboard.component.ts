import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from '../../../../../shared/services/util.service';
import { KanbanService } from '../../../../../shared/services/kanban.service';
import { CoinService } from '../../../../../shared/services/coin.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

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

  gasAmount: number;
  depositAmount: number;
  comment: string;
  link: string;
  fabBalance: number;
  password: string;
  satoshisPerByte: number;
  gasPrice: number;
  gasLimit: number;
  to: string;
  opType: string;
  isAdvance: boolean;
  sendAmount: number;
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
      private toastr: ToastrService,
      private translateServ: TranslateService,
      private localSt: LocalStorage,
      public utilServ: UtilService,
      private coinServ: CoinService,
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
    
    sendCoin() {
      this.opType = 'sendCoin';
      this.ngxSmartModalService.getModal('sendModal').close();
      this.ngxSmartModalService.getModal('passwordModal').open();
      
    }
    
    addGas() {
      console.log('fabBalance===', this.fabBalance);
      if(this.fabBalance <= 0) {
        this.toastr.info(this.translateServ.instant("Not enough FAB in wallet, can not add gas"));
        return;
      }
      this.ngxSmartModalService.getModal('addGasModal').open();  
    }

    deposit(coin) {
      this.currentCoin = coin;
      this.ngxSmartModalService.getModal('depositModal').open();  
    }

    depositConfirm() {
      this.opType = 'deposit';
      this.ngxSmartModalService.getModal('depositModal').close();
      this.ngxSmartModalService.getModal('passwordModal').open(); 
    }

    addGasConfirm() {
      this.opType = 'addGas';
      this.ngxSmartModalService.getModal('addGasModal').close();
      this.ngxSmartModalService.getModal('passwordModal').open(); 

    }

    confirmPassword() {
      const pinHash = this.utilServ.SHA256(this.password).toString();
      if (pinHash !== this.wallet.pwdHash) {
          this.warnPwdErr();
          return;
      }
      if(this.opType == 'addGas') {
        this.addGasDo();
      } else 
      if(this.opType == 'sendCoin') {
        this.sendCoinDo();
      } else
      if(this.opType == 'deposit') {
        this.depositDo();
      }
    }

    depositDo() {

    }
    
    async addGasDo() {
      const amount = this.gasAmount;
      const pin = this.password;

      const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
      if (!seed) {
          this.warnPwdErr();
          return;
      }
      const scarAddress = await this.kanbanServ.getScarAddress();
      console.log('scarAddress=', scarAddress);
      const currentCoin = this.coinServ.formMyCoin(this.wallet.addresses, 'FAB');
      const { txHash, errMsg } = await this.coinServ.depositFab(scarAddress, seed, currentCoin, amount);
      if (errMsg) {
          this.toastr.error(errMsg);
      } else {

        /*
          const addr = environment.addresses.exchangilyOfficial.FAB;

          const item: TransactionItem = {
              walletId: this.wallet.id,
              type: 'Add Gas',
              coin: currentCoin.name,
              tokenType: currentCoin.tokenType,
              amount: amount,
              txid: txHash,
              to: addr,
              time: new Date(),
              confirmations: '0',
              blockhash: '',
              comment: '',
              status: 'pending'
          };
          this.storageService.storeToTransactionHistoryList(item);
          

          if (this.lan === 'zh') {
              this.alertServ.openSnackBarSuccess('加燃料交易提交成功，请等40分钟后查看结果', 'Ok');
          } else {
              this.alertServ.openSnackBarSuccess('Add gas transaction was submitted successfully, please check gas balance 40 minutes later.', 'Ok');
          }
          */
         this.ngxSmartModalService.getModal('passwordModal').close(); 
         this.toastr.info(this.translateServ.instant('Add gas transaction was submitted successfully, please check gas balance 40 minutes later.'));
      }
    }

    async sendCoinDo() {
      const pin = this.password;
      const currentCoin = this.currentCoin;

      const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);

      const amount = this.sendAmount;
      const doSubmit = true;
      const options = {
          gasPrice: this.gasPrice,
          gasLimit: this.gasLimit,
          satoshisPerBytes: this.satoshisPerByte
      };
      const { txHex, txHash, errMsg, txids } = await this.coinServ.sendTransaction(
        this.coinServ.formMyCoin(this.wallet.addresses, currentCoin), seed,
          this.to.trim(), amount, options, doSubmit
      );
      if (errMsg) {
          this.toastr.error(errMsg);
          return;
      }
      if (txHex && txHash) {
        this.toastr.info(this.translateServ.instant('your transaction was submitted successful, please wait a while to check status.'));
        this.ngxSmartModalService.getModal('passwordModal').close(); 
          /*
          const item = {
              walletId: this.wallet.id,
              type: 'Send',
              coin: this.currentCoin,
              amount: amount,
              txid: txHash,
              to: this.to,
              time: new Date(),
              confirmations: '0',
              blockhash: '',
              comment: this.comment,
              status: 'pending'
          };
          console.log('before next');
          this.timerServ.transactionStatus.next(item);
          this.timerServ.checkTransactionStatus(item);
          console.log('after next');
          this.storageService.storeToTransactionHistoryList(item);
          this.coinService.addTxids(txids);
          */
      }
    }
    
    warnPwdErr() {
     this.toastr.error(this.translateServ.instant('Your password is invalid.'));
    }   

    onCoinChange(newCoin) {
      console.log('newCoin==', newCoin);
      this.currentCoin = newCoin;
      this.currentCoinAddress = this.getCurrentCoinAddress();
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
            const fabCoin = this.coins.filter(item => item.coin == 'FAB')[0];
            this.fabBalance = fabCoin.balance;
            console.log('fabCoin==', fabCoin);
            this.currentCoin = exgCoin.coin;
            this.currentCoinAddress = this.getCurrentCoinAddress();
            this.walletBalance = Number(exgCoin.balance) + Number(exgCoin.lockBalance);
            this.walletValue = this.walletBalance * exgCoin.usdValue.USD;
          }
        }
      );
    }

    dlDataUrlBin() {
      const y = document.getElementById('address_qr_code').getElementsByTagName('canvas')[0];
      //console.log('y.src=' + y.src);
      if(y) {
          var link = y.toDataURL("image/png");
          this.link = link;   
      }
   
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


}