import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { AddressService } from 'src/app/modules/shared/services/address.service';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { IddockService } from 'src/app/modules/shared/services/iddock.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import BigNumber from 'bignumber.js';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ToastrService } from 'ngx-toastr';
import { StarService } from 'src/app/modules/shared/services/star.service';

import {PaymentComponent as ParentPaymentComponent} from 'src/app/modules/store/payment/payment.component';

@Component({
  selector: 'app-payment',
  providers: [UserService],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent extends ParentPaymentComponent{}

// export class PaymentComponent implements OnInit{

//     id: string;
//     order: any;
//     discount: number;
//     tax: number;
//     taxRate: number;
//     orderID: string;
//     total: number;
//     subtotal: number;
//     parents: string[];
//     agents: string[];
//     selectedShippingService: string;
//     walletAddress: string;
//     selectedPayment: string;
//     smartContractAddress: string;
//     feeChargerSmartContractAddress: string;
//     shippingFee: number;
//     noWallet: boolean;
//     wallet: any;
//     currency: string;

//     modalRef: BsModalRef;
//     wallets: any;
//     password: string;

//     constructor(
//       private iddockServ: IddockService,
//       private utilServ: UtilService,
//       private web3Serv: Web3Service,
//       private coinServ: CoinService,
//       private kanbanSmartContractServ: KanbanSmartContractService,   
//       private kanbanServ: KanbanService,
//       private starServ: StarService,
//       private spinner: NgxSpinnerService,
//       private modalService: BsModalService,
//       private localSt: LocalStorage,      
//       private router: Router,
//       private route: ActivatedRoute, 
//       private dataServ: DataService,
//       private toastr: ToastrService,
//       private userServ: UserService, 
//       private orderServ: OrderService, 
//       private addressServ: AddressService) {

//     }

//     calculateTotal() {
//       this.subtotal = 0;
//       this.total = 0;
//       if(!this.order || !this.order.items || (this.order.items.length == 0)) {
//         return;
//       }
//       console.log('this.images5');
//       for(let i=0;i<this.order.items.length;i++) {
//         const item = this.order.items[i];
//         this.subtotal += item.price * item.quantity;
//         console.log('');
//       }
      
//       this.subtotal = Number(this.subtotal.toFixed(2));
//       this.tax = new BigNumber(this.subtotal).multipliedBy(new BigNumber(this.taxRate).dividedBy(new BigNumber(100))).toNumber();

//       this.total = new BigNumber(this.subtotal).plus(new BigNumber(this.shippingFee)).plus(new BigNumber(this.tax)).toNumber();
//       ;
//     }

//     ngOnInit() {
//       this.parents = [];
//       this.agents = [];
//       this.orderID = this.route.snapshot.paramMap.get('orderID');
//       this.dataServ.currentWallet.subscribe(
//         (wallet: any) => {
//           this.wallet = wallet;
//         }
//       )

//       this.dataServ.currentStore.subscribe(
//         (store: any) => {
//           this.currency = store.coin;
//           this.smartContractAddress = store.smartContractAddress;
//           this.taxRate = store.taxRate;
//           this.feeChargerSmartContractAddress = store.feeChargerSmartContractAddress;

//           this.orderServ.get(this.orderID).subscribe(
//             (res: any) => {
//               if(res && res.ok) {
//                 this.order = res._body;
//                 console.log('this.order=', this.order);
//                 this.selectPayment(this.order.paymentMethod);
//                 let shippingServiceSelected = 'express';
//                 if(this.order.shippingServiceSelected) {
//                   shippingServiceSelected = this.order.shippingServiceSelected;
//                 }
//                 this.selectShippingService(shippingServiceSelected);
//               }
//             }
//           );
//         }
//       );   
      
//       this.dataServ.currentWalletAddress.subscribe(
//         (walletAddress: string) => {
//           this.walletAddress = walletAddress;
//           if(walletAddress) {
//             this.starServ.getParents(walletAddress).subscribe(
//               (parents: any) => {
//                 this.parents = parents.map(item => this.utilServ.fabToExgAddress(item));
//               }
//             );
//           }
//         }
//       );

//       this.starServ.getAgents(this.feeChargerSmartContractAddress).subscribe(
//         (ret: any) => {
//           if(ret && ret.ok) {
//             const agents = ret._body;
//             this.agents = agents.map(item => this.utilServ.fabToExgAddress(item));
//           }
          
//         }
//       );
      
//       this.discount = 0;
//       this.shippingFee = 0;
//       this.total = 0;
//       this.subtotal = 0;
      


//     }

//     change() {
//       this.router.navigate(['/address/' + this.orderID]);
//     }
    
//     selectShippingService(service: string) {
//       console.log('service=', service);
//       if(!service) {
//         return;
//       }
//       this.selectedShippingService = service;
//       if(service == 'express') {
//         this.shippingFee = 10;
//       } else {
//         this.shippingFee = 0;
//       }
//       this.calculateTotal();
//     }

//     selectPayment(payment: string) {
//       if(!payment) {
//         return;
//       }
//       if(payment == 'usdt') {
//         this.discount = 3;
//       } else {
//         this.discount = 0;
//       }
//       this.selectedPayment = payment;
//     }   

//     placeOrder() {

//       const initialState = {
//         pwdHash: this.wallet.pwdHash,
//         encryptedSeed: this.wallet.encryptedSeed
//       };          
//       this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
  
//       this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
//         this.spinner.show();
//         this.placeOrderDo(seed);
//       });      
//       /*
//       if (!this.selectedShippingService) {
//         return;
//       }
//       if (!this.selectedPayment) {
//         return;
//       }  

//       this.ngxSmartModalServ.getModal('passwordModal').open();
//       */
//     }

//     async placeOrderDo(seed: Buffer) {
//       //const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.password); 


//       const item = {
//         totalSale: this.subtotal,
//         totalShipping: this.shippingFee,
//         totalToPay: this.total * (1 - this.discount / 100),
//         paymentMethod: this.selectedPayment,
//         paymentStatus: 0,
//         charge_id: '',
//         shippingServiceSelected: this.selectedShippingService
//       }



//       const abi = {
//         "inputs": [
//           {
//             "internalType": "bytes30",
//             "name": "objectId",
//             "type": "bytes30"
//           },
//           {
//             "internalType": "uint256",
//             "name": "fullfilmentFee",
//             "type": "uint256"
//           },
//           {
//             "internalType": "address",
//             "name": "_user",
//             "type": "address"
//           },
//           {
//             "internalType": "uint8",
//             "name": "v",
//             "type": "uint8"
//           },
//           {
//             "internalType": "bytes32",
//             "name": "r",
//             "type": "bytes32"
//           },
//           {
//             "internalType": "bytes32",
//             "name": "s",
//             "type": "bytes32"
//           },
//           {
//             "name": "_regionalAgents",
//             "type": "address[]"
//           },          
//           {
//             "internalType": "address[]",
//             "name": "_rewardBeneficiary",
//             "type": "address[]"
//           }
//         ],
//         "name": "payOrder",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//       };
//       const msg = '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId) + '0000';
//       const hashForSignature = this.web3Serv.hashKanbanMessage(msg);
//       const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
//       const privateKey = keyPair.privateKeyBuffer.privateKey; 
//       const signature = this.web3Serv.signKanbanMessageHashWithPrivateKey(hashForSignature, privateKey);  
//       const fulfillmentFee = '0x' + (new BigNumber(this.shippingFee).multipliedBy(new BigNumber(1e18)).toString(16));
//       console.log('fulfillmentFee=', fulfillmentFee);
      
//       console.log('this.shippingfee=', this.shippingFee);  
//       this.parents = [];
//       this.agents = [];
//       const args = [
//         '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId),
//         fulfillmentFee,
//         this.utilServ.fabToExgAddress(this.walletAddress),
//         signature.v,
//         signature.r,
//         signature.s,
//         this.agents,
//         this.parents
//       ];
//       console.log('args==', args);
      







//       /*
//       const abi2 = this.web3Serv.getGeneralFunctionABI(
//         {
//           "constant": true,
//           "inputs": [
//             {
//               "name": "_user",
//               "type": "address"
//             },
//             {
//               "name": "_msg",
//               "type": "bytes32"
//             },
//             {
//               "name": "v",
//               "type": "uint8"
//             },
//             {
//               "name": "r",
//               "type": "bytes32"
//             },
//             {
//               "name": "s",
//               "type": "bytes32"
//             }
//           ],
//           "name": "validateSignature",
//           "outputs": [
//             {
//               "name": "",
//               "type": "bool"
//             }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//         },
//         [ this.utilServ.fabToExgAddress(this.walletAddress),
//           msg,
//           signature.v,
//           signature.r,
//           signature.s]
//       );
//       console.log('arrrrguse=', [ this.utilServ.fabToExgAddress(this.walletAddress),
//         msg,
//         signature.v,
//         signature.r,
//         signature.s]);
//       console.log('this.feeChargerSmartContractAddress==', this.feeChargerSmartContractAddress);
//       this.kanbanServ.kanbanCall(this.feeChargerSmartContractAddress, abi2).subscribe(
//         (ret: any) => {
//           console.log('rettttfor validateSignature =', ret);
//         }
//       );






//       const abi3 = this.web3Serv.getGeneralFunctionABI(
//         {
//           "inputs": [
//             {
//               "internalType": "bytes30",
//               "name": "objectId",
//               "type": "bytes30"
//             },
//             {
//               "internalType": "uint256",
//               "name": "fullfilmentFee",
//               "type": "uint256"
//             },
//             {
//               "internalType": "address",
//               "name": "_user",
//               "type": "address"
//             },
//             {
//               "internalType": "uint8",
//               "name": "v",
//               "type": "uint8"
//             },
//             {
//               "internalType": "bytes32",
//               "name": "r",
//               "type": "bytes32"
//             },
//             {
//               "internalType": "bytes32",
//               "name": "s",
//               "type": "bytes32"
//             }
//           ],
//           "name": "getChargePayOrderParams",
//           "outputs": [
//             {
//               "internalType": "bytes32",
//               "name": "",
//               "type": "bytes32"
//             },
//             {
//               "internalType": "address",
//               "name": "",
//               "type": "address"
//             },
//             {
//               "internalType": "uint32",
//               "name": "",
//               "type": "uint32"
//             },
//             {
//               "internalType": "uint256",
//               "name": "",
//               "type": "uint256"
//             },
//             {
//               "internalType": "uint8",
//               "name": "",
//               "type": "uint8"
//             },
//             {
//               "internalType": "bytes32",
//               "name": "",
//               "type": "bytes32"
//             },
//             {
//               "internalType": "bytes32",
//               "name": "",
//               "type": "bytes32"
//             }
//           ],
//           "stateMutability": "view",
//           "type": "function"
//         },
//         [ 
//           '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId),
//           fulfillmentFee,
//           this.utilServ.fabToExgAddress(this.walletAddress),
//           signature.v,
//           signature.r,
//           signature.s          
//         ]
//       );
//       console.log('arrrrguse=', [ this.utilServ.fabToExgAddress(this.walletAddress),
//         msg,
//         signature.v,
//         signature.r,
//         signature.s]);
//       //console.log('this.feeChargerSmartContractAddress==', this.feeChargerSmartContractAddress);
//       this.kanbanServ.kanbanCall(this.smartContractAddress, abi3).subscribe(
//         (ret: any) => {
//           console.log('rettttfor fee getChargePayOrderParams=', ret);
//         }
//       );






//       const abi4 = this.web3Serv.getGeneralFunctionABI(
//         {
//           "inputs": [
//             {
//               "internalType": "bytes30",
//               "name": "id",
//               "type": "bytes30"
//             }
//           ],
//           "name": "getOrderById",
//           "outputs": [
//             {
//               "components": [
//                 {
//                   "internalType": "bytes30",
//                   "name": "id",
//                   "type": "bytes30"
//                 },
//                 {
//                   "internalType": "uint256",
//                   "name": "total",
//                   "type": "uint256"
//                 }
//               ],
//               "internalType": "struct Ecombar.Order",
//               "name": "",
//               "type": "tuple"
//             }
//           ],
//           "stateMutability": "view",
//           "type": "function"
//         },
//         [ 
//           '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId)        
//         ]
//       );
//       console.log('arrrrguse=', [ this.utilServ.fabToExgAddress(this.walletAddress),
//         msg,
//         signature.v,
//         signature.r,
//         signature.s]);
//       //console.log('this.feeChargerSmartContractAddress==', this.feeChargerSmartContractAddress);
//       this.kanbanServ.kanbanCall(this.smartContractAddress, abi4).subscribe(
//         (ret: any) => {
//           console.log('rettttfor fee getOrderById=', ret);
//         }
//       );
//       */





      
//       const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.smartContractAddress, abi, args);
//       console.log('ret from payment=', ret);    

//       if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
//         item.paymentStatus = 2;
//         const body = ret._body;
//         console.log('body==', body);
//         item.charge_id = body.transactionHash;    
//         console.log('charge_id==', item.charge_id);  
        
//         const updatedOrderForIdDock = {
//           merchantId: this.order.merchantId,
//           items: this.order.items,
//           currency: this.order.currency,
//           transAmount: this.order.transAmount,
//           name: this.order.name,
//           unit: this.order.suite,
//           streetNumber: this.order.streetNumber,
//           streetName: this.order.street,
//           city: this.order.city,
//           province: this.order.province,
//           zip: this.order.postcode,
//           country: this.order.country,
//           ...item
//         };         
//         (await this.iddockServ.updateIdDock(seed, this.order.objectId, 'things', null, updatedOrderForIdDock, null)).subscribe(async res => {
//           if(res) {
//             if(res.ok) {
//               this.orderServ.update2(this.orderID, item).subscribe(
//                 (res: any) => {
//                   if(res && res.ok) {
//                     this.order = res._body;
//                     this.toastr.success('payment was made successfully');
//                     this.spinner.hide();

//                     this.kanbanServ.getExchangeBalance(this.utilServ.fabToExgAddress(this.walletAddress)).subscribe(
//                       (resp: any) => {
//                           console.log('resp in here we go=', resp);
//                           const selected = resp.filter(item => item.coinType == this.coinServ.getCoinTypeIdByName(this.currency));
//                           if(selected && selected.length > 0) {
//                             const currencyBalance = this.utilServ.showAmount(selected[0].unlockedAmount, 18);
//                             this.dataServ.changeCurrencyBalance(Number(currencyBalance));
//                           }
//                       },
//                       error => {
//                       }
//                     );                    
//                     //this.router.navigate(['/place-order/' + this.orderID]);
//                   }
//                 }
//               );  
              
//             } else {
//               this.spinner.hide();
//               this.toastr.error(res._body);
//             }
            
//           }
//         });



//       } else {
//         this.spinner.hide();
//         this.toastr.error('payment failed');
//       }      








//     }
// }