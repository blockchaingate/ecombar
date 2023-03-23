
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import BigNumber from 'bignumber.js';

@Component({
    selector: 'app-order-list',
    providers: [OrderService],
    templateUrl: './order-list.component.html',
    styleUrls: [
        './order-list.component.scss',
        '../../../../../page.scss'
    ]
})
export class OrderListComponent implements OnInit {
    orders: any;  // 多个订单支持，暂不用此方法
    // order: any;
    customerFlag: boolean;
    wallet: any;
    walletAddress: string;
    modalRef: BsModalRef;
    storeId: string;
    shippingFee: number;  // 没用上
    subtotal: number;
    total: number;
    currency: string;
    tax: number;
    taxRate: number;

    constructor(
        public kanbanServ: KanbanService,
        private utilServ: UtilService,
        private web3Serv: Web3Service,
        private coinServ: CoinService,
        private router: Router,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private kanbanSmartContractServ: KanbanSmartContractService,
        private modalService: BsModalService,
        private dataServ: DataService,
        private orderServ: OrderService) {
    }
  
    ngOnInit() {
        this.dataServ.currentWallet.subscribe(
            (wallet: any) => {
                if(wallet) {
                    this.wallet = wallet;
                }
            }
        );
        this.dataServ.currentWalletAddress.subscribe(
            (walletAddress: string) => {
                if(walletAddress) {
                    this.walletAddress = walletAddress;
                    // "/:pageSize/:pageNum" = '/100/0' 也是够用
                    this.orderServ.getMyOrders(walletAddress).subscribe(
                        (res: any) => {
                            // if(res && res.ok) {
                            //   this.orders = res._body;
                            // }
                            console.log("[Orders]=", res);
                            let res2 = [];
                            if (Array.isArray(res)) {  // 数组确认
                                let now = new Date();
                                for (let i = 0; i < res.length; i ++) {  // 数组遍历
                                    if (res[i].paymentStatus == 0) {  // 'waiting for pay'
                                        let time = new Date(res[i].dateCreated);
                                        if (now.getTime() - time.getTime() < 24 * 3600 * 1000) {  // 24 小时
                                            res2.unshift(res[i]);  // 增添元素
                                        }
                                    }
                                }
                            }
                            this.orders = res2;
                            this.calculateTotal();
                        }
                    ); 
                }
            }
        );

        this.dataServ.currentStoreId.subscribe(
            (storeId: string) => {
                this.storeId = storeId;
            }
        );

    }
  
    getItemsCount(order) {
      let count = 0;
      let items = order.items;
      for(let i=0;i<items.length;i++) {
        const item = items[i];
        if(item.quantity) {
          count += item.quantity;
        }
      }
      return count;
    }

    calculateTotal() {
        this.subtotal = 0;
        this.total = 0;
        this.shippingFee = 0;  // 没用上
        if (!this.orders || this.orders.length == 0) {
            return;
        }
        let subtotalBigNumber = new BigNumber(0);
        let taxBigNumber = new BigNumber(0);
        for (let i = 0; i < this.orders.length; i ++) {
            const order = this.orders[i];
            // if (!order || !order.items || order.items.length == 0) {
            //     continue;
            // }
            for (let j = 0; j < order.items.length; j ++) {
                const item = order.items[j];
                // console.log('item===', item);
                this.currency = order.currency;  // 缺陷：因为存在多个 currency
                const price = item.price;
                const quantity = item.quantity;
                const taxRate = item.taxRate;
                const subtotalItem = new BigNumber(price).multipliedBy(new BigNumber(quantity));
                subtotalBigNumber = subtotalBigNumber.plus(subtotalItem);
                taxBigNumber = taxBigNumber.plus(subtotalItem.multipliedBy(taxRate).dividedBy(new BigNumber(100)));
            }
        }
        this.subtotal = subtotalBigNumber.toNumber();
        this.tax = taxBigNumber.toNumber();
        this.total = subtotalBigNumber.plus(taxBigNumber).plus(new BigNumber(this.shippingFee)).toNumber();
    }

    // 万一存在多个订单，先支付一个
    placeOrder() {
        if (this.total <= 0) {  // Fix: 价格为 0 处理
            return;
        }
        if (!this.orders || this.orders.length == 0) {
            return;
        }
        if (!this.wallet || !this.wallet.pwdHash) {
            this.router.navigate(['/wallet']);
            return;
        }

        const initialState = {
            pwdHash: this.wallet.pwdHash,
            encryptedSeed: this.wallet.encryptedSeed
        };
        this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

        this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
            this.spinner.show();
            this.placeOrderDo(seed);
        });      
    }

    async placeOrderDo( seed: Buffer ) {  // 堂食直接支付
        const updated = {
            totalShipping: 0  // 没有运费
        };
        const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        const privateKey = keyPair.privateKeyBuffer.privateKey; 
        const sig = this.kanbanServ.signJsonData(privateKey, updated);
        updated['sig'] = sig.signature;  

        const order = this.orders[0];  // 取第一个
        const orderId = order._id;
        console.log('placeOrder=', orderId);
        this.orderServ.update2(orderId, updated).subscribe(
            (order) => {
                this.orderServ.getPaycoolRewardInfo(orderId, this.walletAddress, 'WithFee').subscribe(
                    async (ret: any) => {
                        const order2 = ret;  // this.order
                        const params = order2.params;  // this.order
                        console.log('params==', params);
                
                        ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, params[0].to, params[0].data);
                        if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
                            ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, params[1].to, params[1].data);
                            if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
                                this.spinner.hide();
                                this.toastr.success('the transaction was procssed successfully');
                                // Fix: 支付后会停在此页面。改为跳去查看所有订单
                                setTimeout( () => {
                                    // this.router.navigate(['/account/orders']);
                                    // http://localhost:4200/store/640f368a23979c464aa2e296/order-list
                                    this.router.navigate(['/store/' + this.storeId + '/order-list']);
                                }, 1000);  // 发现未更新状态，给个延时
                            } else {
                                this.spinner.hide();
                                this.toastr.error('Failed to chargeFund with fee, txid:' + ret._body.transactionHash);
                            }
                        } else {
                            this.spinner.hide();
                            this.toastr.error('Failed to authorizeOperator, txid:' + ret._body.transactionHash);
                        }
                    }
                );
            }
        );
    }
    
    trimText(id:string) {
      return id.substring(0,3) + '...' + id.substring(id.length - 3);
    }
  
    getStatus(order) {
      let status = '';
      const paymentStatus = order.paymentStatus;
      if(!paymentStatus) {
        status = 'waiting for pay';
      } else 
      if(paymentStatus == 1) {
        status = 'paid already';
      } else 
      if(paymentStatus == 2) {
        status = 'payment confirmed';
      } else 
      if(paymentStatus == 3) {
        status = 'payment cancelled';
      } else 
      if(paymentStatus == 4) {
        status = 'payment frozened';
      } else 
      if(paymentStatus == 5) {
        status = 'request refund';
      } else 
      if(paymentStatus == 6) {
        status = 'refunded';
      }
      return status;
    }
  
    deleteOrder(order) {
      this.orderServ.delete(order._id).subscribe(
        (res: any) => {
          
        }
      );
    }
  
    // requestRefund(order: any) {
    //   this.order = order;
  
    //   const initialState = {
    //     pwdHash: this.wallet.pwdHash,
    //     encryptedSeed: this.wallet.encryptedSeed
    //   };          
    //   if(!this.wallet || !this.wallet.pwdHash) {
    //     this.router.navigate(['/wallet']);
    //     return;
    //   }
    //   this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
  
    //   this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
    //     this.spinner.show();
    //     this.requestRefundDo(seed);
    //   });
    // }
    
    // async requestRefundDo(seed: Buffer) {
    //   console.log('this.order=', this.order);
    //   const abi = {
    //     "inputs": [
    //       {
    //         "internalType": "bytes30",
    //         "name": "objectId",
    //         "type": "bytes30"
    //       },
    //       {
    //         "internalType": "address",
    //         "name": "_user",
    //         "type": "address"
    //       },
    //       {
    //         "internalType": "uint8",
    //         "name": "v",
    //         "type": "uint8"
    //       },
    //       {
    //         "internalType": "bytes32",
    //         "name": "r",
    //         "type": "bytes32"
    //       },
    //       {
    //         "internalType": "bytes32",
    //         "name": "s",
    //         "type": "bytes32"
    //       }
    //     ],
    //     "name": "requestRefundWithSig",
    //     "outputs": [
    //       {
    //         "internalType": "bool",
    //         "name": "",
    //         "type": "bool"
    //       }
    //     ],
    //     "stateMutability": "nonpayable",
    //     "type": "function"
    //   };
    //   const msg = '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId) + '0000';
    //   const hashForSignature = this.web3Serv.hashKanbanMessage(msg);
    //   const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    //   const privateKey = keyPair.privateKeyBuffer.privateKey; 
    //   const signature = this.web3Serv.signKanbanMessageHashWithPrivateKey(hashForSignature, privateKey); 
    //   const args = [
    //     '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId),
    //     this.utilServ.fabToExgAddress(this.walletAddress),
    //     signature.v,
    //     signature.r,
    //     signature.s
    //   ];
    //   const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.store.smartContractAddress, abi, args);
    //   this.spinner.hide();
    //   if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
    //     this.toastr.success('Request refund was made successfully');
    //     this.order.paymentStatus = 5;
    //     /*
    //     const data = {
    //       paymentStatus: 5
    //     };
    //     this.orderServ.update2(this.order._id, data).subscribe(
    //       (ret: any) => {
    //         this.spinner.hide();
    //         if(ret && ret.ok) {
    //           this.toastr.success('Request refund was made successfully');
    //           this.order.paymentStatus = 5;
    //         }
    //       }
    //     );
    //     */
    //   } else {
    //     this.toastr.error('Failed to request refund');
    //   }
    // }
  
    // cancelRequestRefund(order: any) {
    //   this.order = order;
  
    //   const initialState = {
    //     pwdHash: this.wallet.pwdHash,
    //     encryptedSeed: this.wallet.encryptedSeed
    //   };          
    //   if(!this.wallet || !this.wallet.pwdHash) {
    //     this.router.navigate(['/wallet']);
    //     return;
    //   }
    //   this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
  
    //   this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
    //     this.spinner.show();
    //     this.cancelRequestRefundDo(seed);
    //   });
    // }
    
    // async cancelRequestRefundDo(seed: Buffer) {
    //   const abi = {
    //     "inputs": [
    //       {
    //         "internalType": "bytes32",
    //         "name": "objectId",
    //         "type": "bytes32"
    //       },
    //       {
    //         "internalType": "address",
    //         "name": "_user",
    //         "type": "address"
    //       },
    //       {
    //         "internalType": "uint8",
    //         "name": "v",
    //         "type": "uint8"
    //       },
    //       {
    //         "internalType": "bytes32",
    //         "name": "r",
    //         "type": "bytes32"
    //       },
    //       {
    //         "internalType": "bytes32",
    //         "name": "s",
    //         "type": "bytes32"
    //       }
    //     ],
    //     "name": "cancelRefundRequestWithSig",
    //     "outputs": [
    //       {
    //         "internalType": "bool",
    //         "name": "",
    //         "type": "bool"
    //       }
    //     ],
    //     "stateMutability": "nonpayable",
    //     "type": "function"
    //   };
    //   const msg = '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId) + '0000';
    //   const hashForSignature = this.web3Serv.hashKanbanMessage(msg);
    //   const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    //   const privateKey = keyPair.privateKeyBuffer.privateKey; 
    //   const signature = this.web3Serv.signKanbanMessageHashWithPrivateKey(hashForSignature, privateKey); 
    //   const args = [
    //     '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId),
    //     this.utilServ.fabToExgAddress(this.walletAddress),
    //     signature.v,
    //     signature.r,
    //     signature.s
    //   ];
    //   const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.store.smartContractAddress, abi, args);
    //   this.spinner.hide();
    //   if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
    //     /*
    //     const data = {
    //       paymentStatus: 2
    //     };
    //     this.orderServ.update2(this.order._id, data).subscribe(
    //       (ret: any) => {
    //         this.spinner.hide();
    //         console.log('ret for update payment=', ret);
    //         if(ret && ret.ok) {
    //           this.toastr.success('Cancel request refund was made successfully');
    //           this.order.paymentStatus = 2;
    //         }
    //       }
    //     );
    //     */
    //     this.toastr.success('Cancel request refund was made successfully');
    //     this.order.paymentStatus = 2;
    //   } else {
    //     this.toastr.error('Failed to cancel request refund');
    //   }
    // }
  
  }
  