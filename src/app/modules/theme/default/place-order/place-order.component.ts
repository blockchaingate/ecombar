import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { TranslateService } from '@ngx-translate/core';
// import BigNumber from 'bignumber.js/bignumber';  // 'bignumber.js'
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { ApiService } from 'src/app/modules/shared/services/api.service';
import { IddockService } from 'src/app/modules/shared/services/iddock.service';
import { PlaceOrderComponent as ParentPlaceOrderComponent } from 'src/app/modules/store/place-order/place-order.component';
@Component({
  selector: 'app-place-order',
  providers: [UserService],
  templateUrl: './place-order.component.html',
  
})

export class PlaceOrderComponent extends ParentPlaceOrderComponent{}
// export class PlaceOrderComponent implements OnInit {

//   id: string;
//   order: any;
//   orderID: string;
//   total: number;
//   subtotal: number;
//   password: string;
//   selectedShippingService: string;
//   selectedPayment: string;
//   shippingFee: number;
//   trans_code: string;
//   payLink: string;
//   code: string;
//   nonce: number;
//   link: string;
//   walletName: string;
//   usdtBalance: number;
//   ps_store_id: string;
//   hpp_key: string;
//   wallets: any;
//   wallet: any;
//   public payPalConfig?: IPayPalConfig;

//   constructor(
//     private iddockServ: IddockService,
//     private router: Router,
//     private localSt: LocalStorage,
//     private route: ActivatedRoute,
//     private toastr: ToastrService,
//     private web3Serv: Web3Service,
//     private translateServ: TranslateService,
//     public utilServ: UtilService,
//     private coinServ: CoinService,
//     private kanbanServ: KanbanService,
//     private orderServ: OrderService,
//     private apiServ: ApiService) {

//   }

//   payWithCreditCard() {
//     window.open('https://esqa.moneris.com/HPPDP/index.php?ps_store_id='
//       + this.ps_store_id + '&hpp_key=' + this.hpp_key
//       + '&order_id=' + this.orderID
//       + '&charge_total=' + this.total.toFixed(2), '_blank');
//   }

//   ngOnInit() {


//     this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

//       if(!wallets || !wallets.items || (wallets.items.length == 0)) {
//         return;
//       }
//       this.wallets = wallets;
//       console.log('this.wallets==', this.wallets);
//       this.wallet = this.wallets.items[this.wallets.currentIndex];
      
//       this.loadWallet();

//     });

//     this.ps_store_id = environment['moneris'].ps_store_id;
//     this.hpp_key = environment['moneris'].hpp_key;

//     this.orderID = this.route.snapshot.paramMap.get('orderID');
//     this.orderServ.get(this.orderID).subscribe(
//       (res: any) => {
//         if (res && res.ok) {
//           this.order = res._body;

//           console.log('this.order=', this.order);
//           this.code = 'n.' + this.order.num;
//           this.payLink = environment.endpoints['website'] + 'ex/' + this.code;
//           this.subtotal = this.order.totalSale;
//           this.shippingFee = this.order.totalShipping;
//           this.total = this.order.totalToPay;
//           const currency = 'USD';
//           const items = this.order.items;

//           const value = this.total.toString();
//           if(this.order.paymentStatus != 2) {
//             this.payPalConfig = {
//               currency,
//               clientId: environment['paypal_client_id'],
//               createOrderOnClient: (data) => <ICreateOrderRequest>{
//                 intent: 'CAPTURE',
//                 purchase_units: [
//                   {
//                     amount: {
//                       currency_code: currency,
//                       value,
//                       breakdown: {
//                         item_total: {
//                           currency_code: currency,
//                           value
//                         }
//                       }
//                     },
//                     items: [{
//                       name: 'Enterprise Subscription',
//                       quantity: '1',
//                       category: 'DIGITAL_GOODS',
//                       unit_amount: {
//                         currency_code: currency,
//                         value,
//                       },
//                     }]
  
//                   }
//                 ]
//               },
//               advanced: {
//                 commit: 'true'
//               },
//               style: {
//                 label: 'paypal',
//                 layout: 'vertical'
//               },
//               onApprove: (data, actions) => {
//                 console.log('onApprove - transaction was approved, but not authorized', data, actions);
//                 const orderID = data.orderID;
//                 const payerID = data.payerID;
  
//                 actions.order.get().then(details => {
//                   console.log('onApprove - you can get full order details inside onApprove: ', details);
//                 });
//               },
//               onClientAuthorization: (data) => {
//                 console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
//                 const orderID = data.id;
//                 if (orderID) {
  
//                   console.log('orderID=', orderID);
//                   this.orderServ.updatePayment(this.orderID, data).subscribe(
//                     (res2: any) => {
//                       if (res2 && res2.ok) {
//                         this.toastr.success('Your payment was confirmed.', '');
  
//                       }
//                     }
//                   );
//                 }
//               },
//               onCancel: (data, actions) => {
//                 console.log('OnCancel', data, actions);
//               },
//               onError: err => {
//                 console.log('OnError', err);
//               },
//               onClick: (data, actions) => {
//                 console.log('onClick', data, actions);
//               },
//             };
//           }



//         }
//       }
//     );
//   }

  
//   loadWallet() {
//     const addresses = this.wallet.addresses;
//     console.log('addresses=', addresses);
//     this.walletName = this.wallet.name;
//     /*
//     this.kanbanServ.getWalletBalances(addresses).subscribe(
//       (res: any) => {
//         console.log('res for getWalletBalances=', res);
//         if(res && res.success) {
//           this.usdtBalance = res.data.filter(item => ((item.coin == 'USDT')))[0].balance;
//         }
//       }
//     );
//     */
//     const fabCoin = addresses.filter(item => item.name === 'FAB')[0];
//     console.log('address=', fabCoin);
//     const exgAddress = this.utilServ.fabToExgAddress(fabCoin.address);
    
//     console.log('exgAddress=', exgAddress);
//    this.kanbanServ.getExchangeBalance(exgAddress).subscribe(
//     (res: any) => {
//       console.log('resdddde==', res);
//       for (let i = 0; i < res.length; i++) {
//         const item = res[i];
//         if (item.coinType == this.coinServ.getCoinTypeIdByName('USDT')) {
//           this.usdtBalance = Number(this.utilServ.showAmount(item.unlockedAmount, 18));
//         }
//       }
//     }
//   );    
//   }


//   dlDataUrlBin() {
//     const y = document.getElementById('address_qr_code').getElementsByTagName('canvas')[0];
//     // console.log('y.src=' + y.src);
//     if (y) {
//       const link = y.toDataURL('image/png');
//       this.link = link;
//     }

//   }

//   change() {
//     this.router.navigate(['/payment/' + this.orderID]);
//   }

//   payWithPaypal() {

//   }

//   pay() {
//     //this.ngxSmartModalService.getModal('passwordModal').open();
//   }

  
//   onConfirmPassword(event) {
//     /*
//     this.ngxSmartModalService.getModal('passwordModal').close();
//     this.password = event;
//     const pinHash = this.utilServ.SHA256(this.password).toString();
//     if (pinHash !== this.wallet.pwdHash) {
//         this.warnPwdErr();
//         return;
//     }
//     this.payOrderDo();  
//     */  
//   }

//   async payOrderDo() {

    
//     const address = environment['addresses'].ecombarOfficial.ETH;
//     const amount = this.order.totalToPay;
//     const coin = this.coinServ.getCoinTypeIdByName('USDT');
//     console.log('address=', address);
    
//     const txHex = await this.txHexforSendToken(
//       this.password, this.wallet, address, coin, new BigNumber(amount).multipliedBy(new BigNumber(1e18)).toFixed()
//     );

//     console.log('txHex=', txHex);

//     this.apiServ.chargeOrder(this.orderID, txHex).subscribe(
//       async (res: any) => {
//         if (res && res.ok) {
//           const order = res._body;
          
//           delete order.objectId;
//           const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.password);
//           (await this.iddockServ.updateIdDockWithNonce(++this.nonce, seed, this.order.objectId, 'things', null, order, null)).subscribe(res => {
//             if(res) {
//               if(res.ok) {
//                 this.order.paymentStatus = 2;
//                 this.toastr.info(this.translateServ.instant('Your order was paid successfully'));
                
//               } else {
      
//               }
              
//             }
//           });


          
//         } else {
//           this.toastr.info(this.translateServ.instant('Your order failed.'));

//         }
//       }
//     );
//   }

//   async txHexforSendToken
//     (pin: string, wallet: any, to: string, coin: number, value: string) {
//     console.log('start txHexforSendToken');
//     const seed = this.utilServ.aesDecryptSeed(wallet.encryptedSeed, pin);
//     const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
//     console.log('keyPairsKanban', keyPairsKanban);
//     const address = await this.kanbanServ.getCoinPoolAddress();
//     console.log('2');
//     const abiHex = this.web3Serv.getTransferFunctionABI(to, coin, value, this.order._id);
//     const nonce = await this.kanbanServ.getTransactionCount(this.utilServ.fabToExgAddress(keyPairsKanban.address));

//     this.nonce = nonce;
//     const txHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce, 0, null);
//     return txHex;
//   }

  
//   warnPwdErr() {
//     this.toastr.error(this.translateServ.instant('Your password is invalid.'));
//    } 

//   payWithWeb() {
//     console.log('begin payWithWeb');


//     console.log('this.payLink==', this.payLink);
//     window.open(this.payLink, '_blank');
//     /*
//     const items = [];
//     let merchantId = '';
//     let currency = '';
//     let trans_amount = this.total;
//     for(let i=0;i<this.order.items.length; i++) {
//       const item = this.order.items[i];
//       merchantId = item.merchantId;
//       currency = item.currency;
//       items.push({
//         productId: item._id,
//         title: item.title,
//         currency: item.currency,
//         quantity: item.quantity,
//         price: item.price
//       });
//     }

//     const data = {
//       app_id: "6bf9403d0c97bd24",
//       format: "JSON",
//       charset: "UTF-8",
//       sign_type: "MD5",
//       sign: "7e2083699dd510575faa1c72f9e35d43",
//       version: "1.0",
//       timestamp: "2018-08-02 15:16:51",
//       method: "pay.qrcodepay",
//       merchant_no: merchantId,
//       payment_method: "WEB",
//       out_order_no: this.orderID,
//       trans_currency: currency,
//       trans_amount: trans_amount,
//       description: "this is a transaction for " + this.orderID,
//       notify_url: "https://notify-url",
//       attach: JSON.stringify(items),
//       effective_minutes: 15
//     }
//     this.apiServ.qrcodepay(data).subscribe(
//         (res: any) => {
//           if(res.ok) {
//             this.trans_code = res._body.trans_code;
//             this.payLink = environment.endpoints['website'] + 'ex/' + this.trans_code;
//             console.log('this.payLink===', this.payLink);
//             window.open(this.payLink, "_blank");
//             //this.startTimer();
//           }

//         }
//     );
//     */
//   }

// }
