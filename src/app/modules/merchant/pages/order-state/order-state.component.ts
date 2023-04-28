
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
import { ToastrService } from 'ngx-toastr';
// import { NgxSpinnerService } from "ngx-bootstrap-spinner";  // 只支持到 @angular/common@^10.0.0
import { Router } from '@angular/router';
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';

@Component({
    selector: 'app-admin-order-state',
    providers: [OrderService],
    templateUrl: './order-state.component.html',
    styleUrls: [
        './order-state.component.scss', 
        '../../../../../page.scss'
    ]
})
export class OrderStateComponent implements OnInit {
    orders: any;
    order: any;
    orderState: any;
    wallet: any;
    walletAddress: any;
    modalRef: BsModalRef;

    constructor(
        public kanbanServ: KanbanService,
        private router: Router,
        private utilServ: UtilService,
        private web3Serv: Web3Service,
        private coinServ: CoinService,
        private toastr: ToastrService,
        // private spinner: NgxSpinnerService,
        private kanbanSmartContractServ: KanbanSmartContractService,
        private modalService: BsModalService,
        private dataServ: DataService,
        private merchantServ: MerchantService,
        private orderServ: OrderService) {
    }

    ngOnInit() {
        // this.dataServ.currentWallet.subscribe(
        //     (wallet: any) => {
        //         this.wallet = wallet;
        //     }
        // ); 

        this.orderState = [ ];
        // this.dataServ.currentWalletAddress.subscribe(
        //     (walletAddress: string) => {
        //         if(walletAddress) {
        //             this.walletAddress = walletAddress;
        //             this.updateOrderState();  // 更新“后台台号状态”
        //         }
        //     }
        // );
        this.updateOrderState();  // 更新“后台台号状态”

        setInterval(() => {
            // location.reload();
            this.updateOrderState();  // 更新“后台台号状态”
        }, 10 * 1000); // 重新加载当前页面，间隔 10 秒

    }

    // 更新“后台台号状态”（即时刷新）
    updateOrderState() {
        this.orderState = [ ];
        // 获取订单列表，之后可用 create 条件
        this.orderServ.getOrderList().subscribe(
            (res: any) => {
                if (res && res.status == 200 && res.data) {
                    console.log("orders=", res.data);
                    this.orders = res.data;

                    if (Array.isArray(this.orders)) {  // 数组确认
                        let data = { };
                        const now = new Date();
                        for (let i = 0; i < this.orders.length; i ++) {  // 数组遍历
                            let order = this.orders[i];
                            if (! order) continue;
                            const time = new Date(order.create);
                            // if (now.getTime() - time.getTime() < 2 * 24 * 3600 * 1000) {  // 24 小时 * 2
                                // if (! order.owner) continue;  // 商家开的单，没有 owner
                                const tableNo = String(order.table);
                                if (! data[tableNo]) {  // 未有记录，给予记录
                                    data[tableNo] = order;
                                } else {  // 已有记录，更新最新记录
                                    const order2 = data[tableNo];
                                    const time2 = new Date(order2.create);
                                    if (time.getTime() > time2.getTime()) {  // 更加新的时间
                                        data[tableNo] = order;
                                    }
                                }
                            // }
                        }
                        console.log("[orderState]=", data);
                        const keys = Object.keys(data);
                        for (let i = 0; i < keys.length; i ++) {  // 数组遍历
                            const no = keys[i];
                            const order = data[no];
                            // 判断与记录的差异
                            const tableOrder = this.merchantServ.getTableOrder(no);
                            console.log("[tableOrder]=", tableOrder);
                            const diff = this.CompareOrders(order, tableOrder);
                            if (! diff) {
                                if (order.status == 0) {  // New Order
                                    order["flag"] = 0;
                                } else if (order.status < 0) {  // 'PayBill'
                                    order["flag"] = 2;
                                } else {
                                    order["flag"] = 1;
                                }
                            }
                            this.orderState.push(order);  // 增添元素(结尾)
                        }
                        this.orders = this.orderState;
                    }
                }
            }
        );

        // if (this.walletAddress) {
        //     // "/:pageSize/:pageNum" = '/100/0'，用着先，以后后端再支持
        //     this.orderServ.gerMerchantOrders(this.walletAddress).subscribe(
        //         (res: any) => {
        //             if (res) {
        //                 this.orders = res;
        //                 // console.log("[Orders]=", res);
        //                 if (Array.isArray(res)) {  // 数组确认
        //                     let data = { };
        //                     const now = new Date();
        //                     for (let i = 0; i < res.length; i ++) {  // 数组遍历
        //                         let order = res[i];
        //                         if (! order) continue;
        //                         const time = new Date(order.dateCreated);
        //                         // if (now.getTime() - time.getTime() < 2 * 24 * 3600 * 1000) {  // 24 小时 * 2
        //                             // if (! order.owner) continue;  // 商家开的单，没有 owner
        //                             if (order && order.externalOrderNumber) {
        //                                 const num = order.externalOrderNumber.match(/\((.*)\)/);  // \( \) 转义符
        //                                 // console.log('num match=', num);
        //                                 // [
        //                                 //     "(8)",
        //                                 //     "8"
        //                                 // ]
        //                                 if (num && num[1]) {  // 要有台号
        //                                     order["tableNo"] = num[1];  // 台号 no (计算)
        //                                 } else {
        //                                     order["tableNo"] = order.owner;
        //                                 }
        //                             } else {
        //                                 order["tableNo"] = order.owner;
        //                             }
        //                             const tableNo = order["tableNo"];
        //                             if (typeof(tableNo) == 'string') {
        //                                 if (! data[tableNo]) {  // 未有记录，给予记录
        //                                     data[tableNo] = order;
        //                                 } else {  // 已有记录，更新最新记录
        //                                     const order2 = data[tableNo];
        //                                     const time2 = new Date(order2.dateCreated);
        //                                     if (time.getTime() > time2.getTime()) {  // 更加新的时间
        //                                         data[tableNo] = order;
        //                                     }
        //                                 }
        //                             }
        //                         // }
        //                     }
        //                     console.log("[orderState]=", data);
        //                     const keys = Object.keys(data);
        //                     for (let i = 0; i < keys.length; i ++) {  // 数组遍历
        //                         const no = keys[i];
        //                         const order = data[no];
        //                         // 判断与记录的差异
        //                         const tableOrder = this.merchantServ.getTableOrder(no);
        //                         console.log("[tableOrder]=", tableOrder);
        //                         const diff = this.CompareOrders(order, tableOrder);
        //                         if (! diff) {
        //                             if (order.memo == 'PayBill') {  // 改为修改 memo
        //                             // if (order.paymentStatus == 2) {  // 'payment confirmed'
        //                                 order["flag"] = 2;
        //                             } else {
        //                                 order["flag"] = 1;
        //                             }
        //                         }
        //                         this.orderState.push(order);  // 增添元素(结尾)
        //                     }
        //                     this.orders = this.orderState;
        //                 }
        //             }
        //         }
        //     );
        // }
    }

    CompareOrders( order: any, order2: any ) {
        if (!order && !order2) return true;  // 两个都为空
        if (!order || !order2) return false;  // 任一个为空

        if (order["id"] != order2["id"]) return false;
        // if (order["owner"] != order2["owner"]) return false;
        // if (order["totalTax"] != order2["totalTax"]) return false;
        // // if (order["totalShipping"] != order2["totalShipping"]) return false;
        // if (order["totalAmount"] != order2["totalAmount"]) return false;
        // // if (order["paymentStatus"] != order2["paymentStatus"]) return false;  // 改为修改 memo

        let len = 0, len2 = 0;
        if (order["items"] && Array.isArray(order["items"])) {
            len = order["items"].length;
        }
        if (order2["items"] && Array.isArray(order2["items"])) {
            len2 = order2["items"].length;
        }
        if (len != len2) return false;

        return true;
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

    trimText( id:string ) {    // 地址不长，不用此函数，用户可复制地址
        return id.substring(id.length - 12);
        // return id.substring(0,3) + '...' + id.substring(id.length - 3);
    }

    getStatus( order ) {
        if (order.status == 0) {
            return 'New order';
        }
        else if (order.status > 0) {
            return 'Placed order';
        }
        else if (order.status < 0) {
            return 'Paid bill';
        }
        return 'Unknow';
        // let status = '';
        // const paymentStatus = order.paymentStatus;
        // if (! paymentStatus) {
        //     status = 'Placed order';  // 'waiting for pay'
        // } else 
        // if (paymentStatus == 1) {
        //     status = 'paid already';
        // } else 
        // if (paymentStatus == 2) {
        //     status = 'Paid bill';  // 'payment confirmed'
        // } else 
        // if (paymentStatus == 3) {
        //     status = 'payment cancelled';
        // } else 
        // if (paymentStatus == 4) {
        //     status = 'payment frozened';
        // } else 
        // if (paymentStatus == 5) {
        //     status = 'request refund';
        // } else 
        // if (paymentStatus == 6) {
        //     status = 'refunded';
        // }
        // return status;
    }

  refund(order: any) {
    this.order = order;

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      // this.spinner.show();
      this.refundDo(seed);
    });
  }
  
  async refundDo(seed: Buffer) {
    console.log('this.order=', this.order);
    const abi = {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "objectId",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "refundWithSig",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const msg = '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId) + '0000';
    const hashForSignature = this.web3Serv.hashKanbanMessage(msg);
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey; 
    const signature = this.web3Serv.signKanbanMessageHashWithPrivateKey(hashForSignature, privateKey); 
    const args = [
      '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId),
      signature.v,
      signature.r,
      signature.s
    ];
    const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.store.smartContractAddress, abi, args);
    // this.spinner.hide();
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      /*
      const data = {
        paymentStatus: 6
      };
      this.orderServ.update2(this.order._id, data).subscribe(
        (ret: any) => {
          // this.spinner.hide();
          if(ret && ret.ok) {
            this.order.paymentStatus = 6;
            this.toastr.success('Refund was made successfully');
          }
        }
      );
      */
      this.order.paymentStatus = 6;
      this.toastr.success('Refund was made successfully');
    } else {
      
      this.toastr.error('Failed to approve refund');
    }
  }
}
