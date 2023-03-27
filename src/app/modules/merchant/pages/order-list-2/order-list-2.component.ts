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
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-admin-order-list-2',
    providers: [OrderService],
    templateUrl: './order-list-2.component.html',
    styleUrls: [
        './order-list-2.component.scss', 
        '../../../../../table.scss',
        '../../../../../page.scss'
    ]
})
export class OrderList2Component implements OnInit {
    orders: any;
    order: any;
    wallet: any;
    modalRef: BsModalRef;
    storeId: string;
    merchantId: string;
    currency: string;
    walletAddress: string;
    tableNo: string;  // 台号 no  // OrderList 的主人
    errMsg = '';

    constructor(
        private route: ActivatedRoute, 
        public kanbanServ: KanbanService,
        private router: Router,
        private utilServ: UtilService,
        private web3Serv: Web3Service,
        private coinServ: CoinService,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private kanbanSmartContractServ: KanbanSmartContractService,
        private modalService: BsModalService,
        private dataServ: DataService,
        private orderServ: OrderService) {
    }

    ngOnInit() {
        this.tableNo = this.route.snapshot.paramMap.get('no');
        // console.log('[OrderList2Component]', this.tableNo);

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
                    // "/:pageSize/:pageNum" = '/100/0'，用着先，以后后端再支持
                    this.orderServ.gerMerchantOrders(walletAddress).subscribe(
                        (res: any) => {
                            if (res) {
                                this.orders = res;
                                console.log("[Orders]=", res);
                                if (Array.isArray(res)) {  // 数组确认
                                    let data = [ ];
                                    for (let i = 0; i < res.length; i ++) {  // 数组遍历
                                        const order = res[i];
                                        if (! order) continue;
                                        if (order.externalOrderNumber) {
                                            const num = order.externalOrderNumber.match(/\((.*)\)/);  // \( \) 转义符
                                            // console.log('num match=', num);
                                            // [
                                            //     "(8)",
                                            //     "8"
                                            // ]
                                            if (num && num[1] && num[1] == this.tableNo) {  // 还要对上桌号
                                                data.push(order);  // 增添元素(结尾)
                                                continue;
                                            }
                                        }
                                        if (order.owner && order.owner == this.tableNo) {  // 兼容旧的情况
                                            data.push(order);  // 增添元素(结尾)
                                            continue;
                                        }
                                    }
                                    this.orders = data;
                                }
                            }
                        }
                    );
                }
            }
        );
        this.dataServ.currentMyStore.subscribe(
            (store: any) => {
                if(store) {
                    this.currency = store.coin;
                    this.storeId = store._id;  // 返回“商家页” products-grid
                    this.merchantId = store.id;  // 小心名字看错
                    console.log('store===', store);
                }
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

    trimText( id:string ) {    // 地址不长，不用此函数，用户可复制地址
        return id.substring(0,3) + '...' + id.substring(id.length - 3);
    }

    getStatus(order) {    // 原电商使用，点餐未使用
        let status = '';
        const paymentStatus = order.paymentStatus;
        if (! paymentStatus) {
            status = 'waiting for pay';
        } else 
        if (paymentStatus == 1) {
            status = 'paid already';
        } else 
        if (paymentStatus == 2) {
            status = 'payment confirmed';
        } else 
        if (paymentStatus == 3) {
            status = 'payment cancelled';
        } else 
        if (paymentStatus == 4) {
            status = 'payment frozened';
        } else 
        if (paymentStatus == 5) {
            status = 'request refund';
        } else 
        if (paymentStatus == 6) {
            status = 'refunded';
        }
        return status;
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
      this.spinner.show();
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
    this.spinner.hide();
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      /*
      const data = {
        paymentStatus: 6
      };
      this.orderServ.update2(this.order._id, data).subscribe(
        (ret: any) => {
          this.spinner.hide();
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

    // 创建新的订单
    newOrder() {
        if (parseInt(this.tableNo) <= 0) {  // 台号 no  // OrderList 的主人
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
            this.newOrderDo(seed);
        });
    }

    async newOrderDo(seed: Buffer) {
        const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        const privateKey = keyPair.privateKeyBuffer.privateKey;

        const tableNo = parseInt(this.tableNo);
        const uuid = uuidv4();  // '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        let uuid2 = uuid.replace(/-/g, '');  // 去掉 - 字符
        uuid2 = `${uuid2}(${tableNo})`;  // 加入台号

        const orderData = { 
            merchantId: this.merchantId, 
            owner: this.walletAddress, 
            currency: this.currency, 
            items: [], 
            memo: 'NewOrder',
            externalOrderNumber: uuid2 };
        console.log('orderData=', orderData);
        // owner: { type: String},
        // totalAmount: {type: Number},
        // totalTax: {type: Number},
        // totalShipping: {type: Number},
        // currency: {type: String, required: true},
        // merchantId: {type: String, required: true},
        // items: [{
        //     title: String,
        //     taxRate: Number,
        //     lockedDays: Number,
        //     rebateRate: Number,
        //     price: Number,
        //     quantity: Number
        // }], 
        const sig = this.kanbanServ.signJsonData(privateKey, orderData);
        orderData['sig'] = sig.signature;  
        this.orderServ.create2(orderData).subscribe(
            (res: any) => {
                if (res) {
                    const body = res;
                    const orderNewID = body._id;
                    this.spinner.hide();

                    location.reload();  // 重新加载当前页面
                }
            },
            err => { 
                this.errMsg = err.message;
                this.spinner.hide();
                this.toastr.error('error while creating order');              
            }
        );  

    }


}
