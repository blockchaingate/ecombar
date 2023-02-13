import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import BigNumber from 'bignumber.js/bignumber';
import { Signature } from '../../../../interfaces/kanban.interface';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { environment } from '../../../../../environments/environment';
import * as bs58 from 'bs58';
import * as createHash from 'create-hash';
import { ReceiveComponent } from '../../modals/receive/receive.component';
import { SendComponent } from '../../modals/send/send.component';
import { AddGasComponent } from '../../modals/add-gas/add-gas.component';
import { DepositComponent } from '../../modals/deposit/deposit.component';
import { WithdrawComponent } from '../../modals/withdraw/withdraw.component';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MyCoin } from '../../../../models/mycoin';
import { TransactionItem } from '../../../../models/transaction-item';
import { TimerService } from 'src/app/modules/shared/services/timer.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { WalletService } from 'src/app/modules/shared/services/wallet.service';
import { LoginSettingModal } from '../../modals/login-setting/login-setting.modal';
import { ShowSeedPhraseModal } from '../../modals/show-seed-phrase/show-seed-phrase.modal';
import { GetFreeGasComponent } from '../../modals/get-free-gas/get-free-gas.component';
import { StarService } from 'src/app/modules/shared/services/star.service';

@Component({
  selector: 'app-admin-wallet-dashboard',
  providers: [],
  templateUrl: './wallet-dashboard.component.html',
  styleUrls: [ ]
})
export class WalletDashboardComponent implements OnInit{
  coins: any;
  wallets: any;
  wallet: any;
  subtab: string;
  addresses: any;
  rewards: any;
  withdrawAmount: number;
  currentCoinId: number;
  gasAmount: number;
  depositAmount: number;
  comment: string;
  link: string;
  transactions: any;
  sendCoinParams: any;
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
  modalRef: BsModalRef;
  currentCoin: string;
  currentCoinAddress: string;
  walletAddress: string;
  kanbanAddress: string;
  walletBalance: number;
  assets: any;
  walletValue: number;
  transactionHistories: any;
  merchantTransactionHistories: any;
  gas: any;
  currentTab: string;
  
   constructor(
      private toastr: ToastrService,
      private translateServ: TranslateService,
      private localSt: LocalStorage,
      public utilServ: UtilService,
      private timerServ: TimerService,
      private modalServ: BsModalService,
      private web3Serv: Web3Service,
      private walletServ: WalletService,
      private storageServ: StorageService,
      private coinServ: CoinService,
      private starServ: StarService,
      private kanbanServ: KanbanService,
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {
      this.gas = 0;
      this.currentTab = 'wallet';
      this.subtab = 'assets';
      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

        if(!wallets || !wallets.items || (wallets.items.length == 0)) {
          return;
        }
        this.wallets = wallets;
        if(this.wallets.currentIndex >= this.wallets.items.length) {
          this.onChange(this.wallets.items.length - 1);
          return;
        }
        this.wallet = this.wallets.items[this.wallets.currentIndex];
        
        this.loadWallet();

      });
    }
    
    receive() {
      const initialState = {
        addresses: this.addresses,
        coins: this.coins
      }
      this.modalRef = this.modalServ.show(ReceiveComponent, {initialState});      
    }
    
    
    getFreeGas() {
      if(this.gas > 0) {
        this.toastr.info(this.translateServ.instant("You cannot get free gas"));
        return;
      } 

      const initialState = {
        address: this.walletAddress
      }
      this.modalRef = this.modalServ.show(GetFreeGasComponent, {initialState});  
  
      this.modalRef.content.onClose.subscribe(result => {
        this.gas = result;
      });
    }

   async checkAmount(seed) {
    //this.sendCoinParams
    //this.coins
    let fabBalance = 0;
    let ethBalance = 0;
    let btcBalance = 0;
    let trxBalance = 0;

    const amount = this.sendCoinParams.sendAmount;
    const currentCoin = this.sendCoinParams.currentCoin;
    const mycoin = this.coinServ.formMyCoin(this.addresses, currentCoin);
    const to = this.sendCoinParams.to;
    const options = {
      gasPrice: this.sendCoinParams.gasPrice,
      gasLimit: this.sendCoinParams.gasLimit,
      satoshisPerBytes: this.sendCoinParams.satoshisPerByte,
      feeLimit: this.sendCoinParams.feeLimit,
      getTransFeeOnly: true
    };
    const { transFee, tranFeeUnit } = await this.coinServ.sendTransaction(
      mycoin, seed,
      to, amount, options, false
    );    

    
    for (let i = 0; i < this.wallet.mycoins.length; i++) {
        if (this.wallet.mycoins[i].name === 'FAB' && !fabBalance) {
            fabBalance = this.wallet.mycoins[i].balance;
        } else if (this.wallet.mycoins[i].name === 'ETH' && !ethBalance) {
            ethBalance = this.wallet.mycoins[i].balance;
        } else if (this.wallet.mycoins[i].name === 'BTC' && !btcBalance) {
            btcBalance = this.wallet.mycoins[i].balance;
        } else if (this.wallet.mycoins[i].name === 'TRX' && !trxBalance) {
            trxBalance = this.wallet.mycoins[i].balance;
        }
    }

    const currentCoinBalance = this.coins.filter(item => item.coin == currentCoin)[0].balance;

    if(mycoin.tokenType) {
      if(currentCoinBalance < amount) {
       this.toastr.error(
         this.translateServ.instant('Insufficient Coin', {coin: currentCoin}), 
         this.translateServ.instant('Ok')); 
      }
      else if(
        ((tranFeeUnit == 'ETH') && (ethBalance < transFee))
        || ((tranFeeUnit == 'FAB') && (fabBalance < transFee))
        || ((tranFeeUnit == 'TRX') && (trxBalance < transFee))
      ) {
        this.toastr.error(
          this.translateServ.instant('Insufficient Coin', {coin: tranFeeUnit}), 
          this.translateServ.instant('Ok'));   
      }
    } else {
      if(currentCoinBalance < amount + transFee) {
        this.toastr.error(
          this.translateServ.instant('Insufficient Coin', {coin: tranFeeUnit}), 
          this.translateServ.instant('Ok'));        
      }
    }
    return true;
}

   send() {
    const initialState = {
      coins: this.coins,
      addresses: this.addresses
    }
    this.modalRef = this.modalServ.show(SendComponent, {initialState});

    this.modalRef.content.onClose.subscribe(result => {
      this.sendCoinParams = result;
      //console.log('results', result);
      const initialState = {
        coins: this.coins,
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onClose.subscribe( (seed: Buffer) => {

        this.kanbanServ.getWalletBalances(this.addresses).subscribe(
          (res: any) => {
            console.log('res for getWalletBalances=', res);
            if (res && res.success) {
              if(!this.checkAmount(seed)) {
                return;
              }
              this.sendCoinDo(seed);
            }
          });        
        
      });      
    });    
  }

  async sendCoinDo(seed: Buffer) {
    const currentCoin = this.sendCoinParams.currentCoin;

    const amount = this.sendCoinParams.sendAmount;
    const to = this.sendCoinParams.to.trim();
    const doSubmit = true;
    const options = {
      gasPrice: this.sendCoinParams.gasPrice,
      gasLimit: this.sendCoinParams.gasLimit,
      satoshisPerBytes: this.sendCoinParams.satoshisPerByte,
      feeLimit: this.sendCoinParams.feeLimit
    };
    const mycoin: MyCoin = this.coinServ.formMyCoin(this.wallet.addresses, currentCoin);
    const { txHex, txHash, errMsg, txids } = await this.coinServ.sendTransaction(
      mycoin, seed,
      to, amount, options, doSubmit
    );
    if (errMsg) {
      this.toastr.error(errMsg);
      return;
    }
    if (txHex && txHash) {
      this.toastr.info(
        this.translateServ.instant('your transaction was submitted successful, please wait a while to check status.'));
      //this.ngxSmartModalService.getModal('passwordModal').close();
      
      const item:TransactionItem = {
          walletId: this.wallet.id,
          type: 'Send',
          coin: currentCoin,
          tokenType: mycoin.tokenType,
          amount: amount,
          txid: txHash,
          to: this.to,
          time: new Date(),
          confirmations: '0',
          blockhash: '',
          comment: this.sendCoinParams.comment,
          status: 'pending'
      };
      this.timerServ.transactionStatus.next(item);
      this.timerServ.checkTransactionStatus(item);
      this.storageServ.storeToTransactionHistoryList(item);
      
    }
  }

    addGas() {
      console.log('fabBalance===', this.fabBalance);
      if(this.fabBalance <= 0) {
        this.toastr.info(this.translateServ.instant("Not enough FAB in wallet, can not add gas"));
        return;
      } 

      this.modalRef = this.modalServ.show(AddGasComponent);
  
      this.modalRef.content.onClose.subscribe(result => {
        this.gasAmount = result;
        if(this.fabBalance <= 0) {
          this.toastr.info(this.translateServ.instant("Not enough FAB in wallet, can not add gas"));
          return;
        }   
        
        const initialState = {
          coins: this.coins,
          pwdHash: this.wallet.pwdHash,
          encryptedSeed: this.wallet.encryptedSeed
        };          
        
        this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
  
        this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
          this.addGasDo(seed);       
          
        });         

      });      
    }

    depositCoin(coin) {
      console.log('coin for deposit=', coin);
      this.currentCoin = coin.coin;
      this.modalRef = this.modalServ.show(DepositComponent);
  
      this.modalRef.content.onClose.subscribe(result => {
        this.depositAmount = result;

        const initialState = {
          coins: this.coins,
          pwdHash: this.wallet.pwdHash,
          encryptedSeed: this.wallet.encryptedSeed
        };          
        
        this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
  
        this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
          this.depositDo(seed);
        });        
      });
    }



    withdrawCoin(coinId) {
      this.currentCoinId = coinId;
      this.currentCoin = this.utilServ.getCoinNameByTypeId(this.currentCoinId);
      this.modalRef = this.modalServ.show(WithdrawComponent);
  
      this.modalRef.content.onClose.subscribe(result => {
        this.withdrawAmount = result;

        const initialState = {
          coins: this.coins,
          pwdHash: this.wallet.pwdHash,
          encryptedSeed: this.wallet.encryptedSeed
        };          
        
        this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
  
        this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
          this.withdrawDo(seed);
        });        
      });      
    }

    withdrawConfirm() {
      this.opType = 'withdraw';
      //this.ngxSmartModalService.getModal('withdrawModal').close();
      //this.ngxSmartModalService.getModal('passwordModal').open(); 
    }

    addGasConfirm() {
      this.opType = 'addGas';
      //this.ngxSmartModalService.getModal('addGasModal').close();
      //this.ngxSmartModalService.getModal('passwordModal').open(); 

    }


    async withdrawDo(seed: Buffer) {
      const amount = this.withdrawAmount;
      const currentCoin = this.coinServ.formMyCoin(this.wallet.addresses, this.currentCoin);

      const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const amountInLink = new BigNumber(amount).multipliedBy(new BigNumber(1e18)); // it's for all coins.
      let addressInWallet = currentCoin.receiveAdds[0].address;

      if (currentCoin.name === 'BTC' || currentCoin.name === 'FAB' || currentCoin.name === 'DOGE' || currentCoin.name === 'LTC') {
          const bytes = bs58.decode(addressInWallet);
          console.log('bytes=', bytes);
          addressInWallet = bytes.toString('hex');
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
            this.toastr.info(this.translateServ.instant('Your withdraw request is pending.'));
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

    async addGasDo(seed: Buffer) {
      const amount = this.gasAmount;


      const scarAddress = await this.kanbanServ.getScarAddress();
      console.log('scarAddress=', scarAddress);
      const currentCoin = this.coinServ.formMyCoin(this.wallet.addresses, 'FAB');
      const { txHash, errMsg } = await this.coinServ.depositFab(scarAddress, seed, currentCoin, amount);
      if (errMsg) {
          this.toastr.error(errMsg);
      } else {

        
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
          this.storageServ.storeToTransactionHistoryList(item);
          
         this.toastr.info(this.translateServ.instant('Add gas transaction was submitted successfully, please check gas balance 40 minutes later.'));
      }
    }

    async depositDo(seed: Buffer) {
      const currentCoin = this.currentCoin;

      const amount = this.depositAmount;

      const coinType = this.coinServ.getCoinTypeIdByName(currentCoin);

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
  /*
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

      }
    }
    */
 

    onCoinChange(newCoin) {
      console.log('newCoin==', newCoin);
      this.currentCoin = newCoin;
      this.currentCoinAddress = this.getCurrentCoinAddress();
    }

    changeTab(tabName: string) {
      this.currentTab = tabName;
      if(tabName == 'history') {
        this.starServ.getTransactionHisotryForCustomer(this.walletAddress).subscribe(
          (ret: any) => {
            if(ret && ret.ok) {
              this.transactionHistories = ret._body;
            }
          }
        );
      } else
      if(tabName == 'historyMerchant') {
        this.starServ.getTransactionHisotryForMerchant(this.walletAddress).subscribe(
          (ret: any) => {
            if(ret && ret.ok) {
              this.merchantTransactionHistories = ret._body;
            }
          }
        );        
      }
    }

    onChange(index) {
      this.wallet = this.wallets.items[index];
      this.wallets.currentIndex = index;

      this.localSt.setItem('ecomwallets', this.wallets).subscribe(() => {
        this.walletServ.refreshWallets(this.wallets);
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

      if(
        ['EXG', 'DUSD', 'DCAD', 'DCNY', 'DJPY', 'DGBP', 
        'DEURO', 'DAUD', 'DMYR', 'DKRW', 'DPHP', 
        'DTHB', 'DTWD', 'DSGD', 'DHKD', 'DINR',
        'DMXN', 'DBRL', 'DNGN', 'BST', 'DSC'
    ].indexOf(this.currentCoin) >= 0) {
        return fabAddress;
      } 
      return ethAddress;
    }

    addWallet() {
      this.router.navigate(['/wallet/create-wallet']);
    }

    importWallet() {
      this.router.navigate(['/wallet/import-wallet']);
    }
    
    async getRewards(address: string) {
      /*
      const abi = {};
      const args = [address];
      const abiData = this.web3Serv.getGeneralFunctionABI(
        abi, args
      );
      const lockers = this.kanbanServ.kanbanCall(environment.addresses.smartContract.locker,abiData).toPromise();
      */
    }

    loadWallet() {
      const addresses = this.wallet.addresses;
      this.addresses = addresses;
      const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
      this.walletAddress = walletAddressItem.address;
      this.kanbanAddress = this.utilServ.fabToExgAddress(this.walletAddress);
      this.refreshGas();
      this.refreshAssets();
      this.refreshRewards();
      this.kanbanServ.getWalletBalances(addresses).subscribe(
        async (res: any) => {
          if(res && res.success) {
            this.coins = res.data.filter(item => ((item.coin != 'CAD') && (item.coin != 'RMB')));
            const rewards = await this.getRewards(this.kanbanAddress);
            const exgCoin = this.coins.filter(item => item.coin == 'EXG')[0];
            const fabCoin = this.coins.filter(item => item.coin == 'FAB')[0];
            this.fabBalance = fabCoin.balance;
            this.currentCoin = exgCoin.coin;
            this.currentCoinAddress = this.getCurrentCoinAddress();
            this.walletBalance = Number(exgCoin.balance) + (Number(exgCoin.lockBalance) > 0 ? Number(exgCoin.lockBalance) : 0);
            this.walletValue = this.walletBalance * exgCoin.usdValue.USD;
          }
        }
      );

      this.coinServ.getTransactionHistoryEvents(addresses).subscribe(
        (res: any) => {
            if (res && res.success) {
                const data = res.data;
                this.transactions = data;
            }
        }
      );       
    }


  loginSetting() {

    const initialState = {
      coins: this.coins,
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClosePin.subscribe( (pin: string) => {
      this.modalRef = this.modalServ.show(LoginSettingModal);
      this.modalRef.content.onClose.subscribe( (newPassword: string) => {
        this.wallet = this.walletServ.updateWalletPassword(this.wallet, pin, newPassword);
        this.walletServ.updateToWalletList(this.wallet, this.wallets.currentIndex);
        this.toastr.info(
          this.translateServ.instant('Your password was changed successfully'),
          this.translateServ.instant('Ok'));
      });
    }); 
  
  }

  showSeedPhrase() {
    const initialState = {
      coins: this.coins,
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClosePin.subscribe( (pin: string) => {
      const seedPhrase = this.utilServ.aesDecrypt(this.wallet.encryptedMnemonic, pin);
      const initialState = {
        seedPhrase
      };
      this.modalRef = this.modalServ.show(ShowSeedPhraseModal, { initialState });     
    });

  }


  deleteWallet() {
    const initialState = {
      coins: this.coins,
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClosePin.subscribe( (pin: string) => {
      console.log('this.wallets=', this.wallets);
      this.wallets.items.splice(this.wallets.currentIndex, 1);
      if(this.wallets.items.length > 0) {
        this.wallets.currentIndex = 0;
      } else {
        this.wallets.currentIndex = -1;
      }

      console.log('this.wallets==', this.wallets);
      this.walletServ.updateWallets(this.wallets).subscribe((res: any) => {
        console.log('res===', res);
        this.toastr.info(
          this.translateServ.instant('Your wallet was deleted successfully'),
          this.translateServ.instant('Ok')); 
      });
     
    });
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

    refreshRewards() {
      this.starServ.getLockers(this.utilServ.exgToFabAddress(this.kanbanAddress)).subscribe(
        (resp) => {
          console.log('resp for rewards=', resp);
          if(resp && resp.ok) {
            this.rewards = resp._body;
          }
        }
      );
    }

    refreshGas() {

      this.kanbanServ.getKanbanBalance(this.kanbanAddress).subscribe(
          (resp: any) => {
              // console.log('resp=', resp);
              const balance = resp.balance.FAB ? resp.balance.FAB : resp.balance;
              const fab = this.utilServ.stripHexPrefix(balance);
              this.gas = this.utilServ.hexToDec(fab) / 1e18;

          },
          error => {
              // console.log('errorrrr=', error);
          }
      );
  }


}