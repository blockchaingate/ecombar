import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from '../../../../../shared/services/util.service';
import { KanbanService } from '../../../../../shared/services/kanban.service';
import { CoinService } from '../../../../../shared/services/coin.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import BigNumber from 'bignumber.js/bignumber';
import { Signature } from '../../../../../../interfaces/kanban.interface';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { environment } from '../../../../../../../environments/environment';
import * as bs58 from 'bs58';
import * as createHash from 'create-hash';

@Component({
  selector: 'app-admin-wallet-dashboard',
  providers: [],
  templateUrl: './wallet-dashboard.component.html',
  styleUrls: ['./wallet-dashboard.component.scss',  '../../../../../../../table.scss',  '../../../../../../../select.scss',  '../../../../../../../button.scss']
})
export class WalletDashboardComponent implements OnInit{
  coins: any;
  wallets: any;
  wallet: any;
  withdrawAmount: number;
  currentCoinId: number;
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
  kanbanGasPrice: number;
  kanbanGasLimit: number;
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
      private web3Serv: Web3Service,
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

        if(!wallets || !wallets.items || (wallets.items.length == 0)) {
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

    withdraw(coinId, coin) {
      this.currentCoinId = coinId;
      this.currentCoin = coin;
      this.ngxSmartModalService.getModal('withdrawModal').open();  
    }

    withdrawConfirm() {
      this.opType = 'withdraw';
      this.ngxSmartModalService.getModal('withdrawModal').close();
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
        console.log('deposit do start');
        this.depositDo();
      } else
      if(this.opType == 'withdraw') {
        console.log('withdrawDo do start');
        this.withdrawDo();
      }      
    }

    async withdrawDo() {
      const amount = this.withdrawAmount;
      const pin = this.password;
      const currentCoin = this.coinServ.formMyCoin(this.wallet.addresses, this.currentCoin);
      const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
      if (!seed) {
        this.warnPwdErr();
        return;
      }
      console.log('amount withdraw=', amount);
      const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const amountInLink = new BigNumber(amount).multipliedBy(new BigNumber(1e18)); // it's for all coins.
      let addressInWallet = currentCoin.receiveAdds[0].address;

      if (currentCoin.name === 'BTC' || currentCoin.name === 'FAB' || currentCoin.name === 'DOGE' || currentCoin.name === 'LTC') {
          const bytes = bs58.decode(addressInWallet);
          console.log('bytes=', bytes);
          addressInWallet = bytes.toString('hex');

          console.log('addressInWallet=', addressInWallet);
      } else if (currentCoin.name === 'BCH') {
          const keyPairsCurrentCoin = this.coinServ.getKeyPairs('BCH', seed, 0, 0, 'b');
          let prefix = '6f';
          if (environment.production) {
              prefix = '00';
          }
          // address = prefix + this.stripHexPrefix(address);
          const addr = prefix + keyPairsCurrentCoin.addressHash;
          const buf = Buffer.from(addr, 'hex');

          const hash1 = createHash('sha256').update(buf).digest().toString('hex');
          const hash2 = createHash('sha256').update(Buffer.from(hash1, 'hex')).digest().toString('hex');

          addressInWallet = addr + hash2.substring(0, 8);
      } else if (currentCoin.tokenType === 'FAB') {
          let fabAddress = '';
          for (let i = 0; i < this.wallet.mycoins.length; i++) {
              const coin = this.wallet.mycoins[i];
              if (coin.name === 'FAB') {
                  fabAddress = coin.receiveAdds[0].address;
              }
          }
          if (fabAddress === '') {
            this.toastr.error(this.translateServ.instant('FAB address not found.'));
            /*
              if (this.lan === 'zh') {
                  this.alertServ.openSnackBar('没有FAB地址。', 'Ok');
              } else {
                  this.alertServ.openSnackBar('FAB address not found.', 'Ok');
              }
              */
              return;
          }
          const bytes = bs58.decode(fabAddress);
          addressInWallet = bytes.toString('hex');
          console.log('addressInWallet for exg', addressInWallet);
      }

      const abiHex = this.web3Serv.getWithdrawFuncABI(this.currentCoinId, amountInLink, addressInWallet);

      console.log('abiHex===', abiHex);
      const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
      const nonce = await this.kanbanServ.getTransactionCount(this.utilServ.fabToExgAddress(keyPairsKanban.address));

      this.gasPrice = Number(this.gasPrice);
      this.gasLimit = Number(this.gasLimit);
      if (this.gasPrice <= 0 || this.gasLimit <= 0) {
        /*
          if (this.lan === 'zh') {
              this.alertServ.openSnackBar('燃料价格或限量错误。', 'Ok');
          } else {
              this.alertServ.openSnackBar('Invalid gas price or gas limit.', 'Ok');
          }
          */
         this.toastr.error(this.translateServ.instant('Invalid gas price or gas limit.'));
          return;
      }
      const options = {
          gasPrice: this.gasPrice,
          gasLimit: this.gasLimit
      };

      const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, 0, options);

      this.kanbanServ.sendRawSignedTransaction(txKanbanHex).subscribe((resp: any) => {
          // console.log('resp=', resp);
          if (resp && resp.transactionHash) {
            this.toastr.error(this.translateServ.instant('Your withdraw request is pending.'));
              /*
              this.modalWithdrawRef.hide();
              this.kanbanServ.incNonce();
              if (this.lan === 'zh') {
                  this.alertServ.openSnackBarSuccess('提币请求提交成功，等待处理。', 'Ok');
              } else {
                  this.alertServ.openSnackBarSuccess('Your withdraw request is pending.', 'Ok');
              }
              */
          } else {
            this.toastr.error(this.translateServ.instant('Errors happened, please try again.'));
            /*
              if (this.lan === 'zh') {
                  this.alertServ.openSnackBar('发生错误，请再试一次。', 'Ok');
              } else {
                  this.alertServ.openSnackBar('Errors happened, please try again.', 'Ok');
              }
            */
          }
      });
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

    async depositDo() {
      const currentCoin = this.currentCoin;

      const amount = this.depositAmount;
      const pin = this.password;

      const coinType = this.coinServ.getCoinTypeIdByName(currentCoin);

      console.log('coinType is', coinType);
      const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, pin);
      if (!seed) {
          this.warnPwdErr();
          return;
      }

      console.log('currentCoin==', currentCoin);
      const myCoin = this.coinServ.formMyCoin(this.wallet.addresses, currentCoin);
      let keyPairs = this.coinServ.getKeyPairs(myCoin.tokenType ? myCoin.tokenType : myCoin.name, seed, 0, 0, 'b');
      keyPairs.tokenType = myCoin.tokenType;
      const officalAddress = this.coinServ.getOfficialAddress(currentCoin);
      if (!officalAddress) {
        /*
          if (this.lan === 'zh') {
              this.alertServ.openSnackBar(currentCoin.name + '官方地址无效', 'Ok');
          } else {
              this.alertServ.openSnackBar('offical address for ' + currentCoin.name + ' is unavailable', 'Ok');
          }
          */
         this.toastr.error(this.translateServ.instant('offical address is unavailable'));
          return;
      }

      
      const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');

      const addressInKanban = this.utilServ.fabToExgAddress(keyPairsKanban.address) ;

      const doSubmit = false;
      const options = {
          gasPrice: this.gasPrice,
          gasLimit: this.gasLimit,
          satoshisPerBytes: this.satoshisPerByte
      };
      const { txHex, txHash, errMsg, amountInTx, txids } = await this.coinServ.sendTransaction(
          this.coinServ.formMyCoin(this.wallet.addresses, currentCoin), seed, officalAddress, 
          amount, options, doSubmit
      );

      if (errMsg) {
          this.toastr.error(errMsg);
          return;
      }

      if (!txHex) {
         this.toastr.error(this.translateServ.instant('Internal error for txHex'));
          return;
      }

      if(!txHash) {
        this.toastr.error(this.translateServ.instant('Internal error for txHash'));
        return;        
      }
      const amountInLink = new BigNumber(amount).multipliedBy(new BigNumber(1e18)); // it's for all coins.

      const amountInLinkString = amountInLink.toFixed();
      const amountInTxString = amountInTx.toFixed();

      if (amountInLinkString.indexOf(amountInTxString) === -1) {
        /*
          if (this.lan === 'zh') {
              this.alertServ.openSnackBar('转账数量不相等', 'Ok');
          } else {
              this.alertServ.openSnackBar('Inequal amount for deposit', 'Ok');
          }
          */
         this.toastr.error(this.translateServ.instant('Inequal amount for deposit'));
          return;
      }

      const subString = amountInLinkString.substr(amountInTxString.length);
      if (subString && Number(subString) !== 0) {
          console.log('not equal 2');
          /*
          if (this.lan === 'zh') {
              this.alertServ.openSnackBar('转账数量不符合', 'Ok');
          } else {
              this.alertServ.openSnackBar('deposit amount not the same', 'Ok');
          }
          */
         this.toastr.error(this.translateServ.instant('deposit amount not the same'));
          return;
      }

      const originalMessage = this.coinServ.getOriginalMessage(coinType, this.utilServ.stripHexPrefix(txHash)
          , amountInLink, this.utilServ.stripHexPrefix(addressInKanban));

      console.log('originalMessage in deposit=', originalMessage);
      const signedMessage: Signature = this.coinServ.signedMessage(originalMessage, keyPairs);


      const coinPoolAddress = await this.kanbanServ.getCoinPoolAddress();
      const abiHex = this.web3Serv.getDepositFuncABI(coinType, txHash, amountInLink, addressInKanban, signedMessage);

      console.log('abiHex=', abiHex);
      const nonce = await this.kanbanServ.getTransactionCount(addressInKanban);
      // const nonce = await this.kanbanServ.getNonce(addressInKanban);
      // console.log('nonce there we go =', nonce);
      const optionsKanban = {
          gasPrice: this.kanbanGasPrice,
          gasLimit: this.kanbanGasLimit,
      };
      const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, coinPoolAddress, nonce, 0, optionsKanban);

      console.log('txKanbanHex=', txKanbanHex);
      // return 0;
      this.kanbanServ.submitDeposit(txHex, txKanbanHex).subscribe((resp: any) => {
          // console.log('resp=', resp);
          if (resp && resp.data && resp.data.transactionID) {
              /*
              const item = {
                  walletId: this.wallet.id,
                  type: 'Deposit',
                  coin: currentCoin.name,
                  tokenType: currentCoin.tokenType,
                  amount: amount,
                  txid: resp.data.transactionID,
                  to: officalAddress,
                  time: new Date(),
                  confirmations: '0',
                  blockhash: '',
                  comment: '',
                  status: 'pending'
              };
              this.storageService.storeToTransactionHistoryList(item);
              this.timerServ.transactionStatus.next(item);
              this.timerServ.checkTransactionStatus(item);
              */
              //this.kanbanServ.incNonce();
              //this.coinServ.addTxids(txids);
              /*
              if (this.lan === 'zh') {
                  this.alertServ.openSnackBarSuccess('转币去交易所请求已提交，请等待' + environment.depositMinimumConfirmations[currentCoin.name] + '个确认', 'Ok');
              } else {
                  this.alertServ.openSnackBarSuccess('Moving fund to DEX was submitted, please wait for ' + environment.depositMinimumConfirmations[currentCoin.name] + ' confirmations.', 'Ok');
              }
              */

             this.ngxSmartModalService.getModal('passwordModal').close(); 
             this.toastr.info(this.translateServ.instant('Moving fund to DEX was submitted, please wait for ') 
             + environment.depositMinimumConfirmations[currentCoin] + this.translateServ.instant('confirmations.'));
          } else if (resp.error) {
            this.toastr.error(resp.error);
              //this.alertServ.openSnackBar(resp.error, 'Ok');
          }
      },
          error => {
              console.log('error====');
              console.log(error);
              if (error.error && error.error.error) {
                this.toastr.error(error.error.error);
                  //this.alertServ.openSnackBar(error.error.error, 'Ok');
              } else if (error.message) {
                this.toastr.error(error.message);
                  //this.alertServ.openSnackBar(error.message, 'Ok');
              }
          }
      );

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

    onChange(index) {
      console.log('index==', index);
      this.wallet = this.wallets.items[index];
      this.wallets.currentIndex = index;
      console.log('this.wallet=', this.wallet);

      this.localSt.setItem('ecomwallets', this.wallets).subscribe(() => {
        this.loadWallet();
      });
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

    addWallet() {
      this.router.navigate(['/admin/create-wallet']);
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