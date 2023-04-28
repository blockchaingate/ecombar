
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { Router } from '@angular/router';
import { TranslateService } from 'src/app/modules/shared/services/translate.service';
import { CartItem, CartItemForSmartContract } from 'src/app/modules/shared/models/cart-item';
import { groupBy } from 'src/app/modules/shared/utils/array-tool';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { IddockService } from 'src/app/modules/shared/services/iddock.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
// import { NgxSpinnerService } from "ngx-bootstrap-spinner";  // 只支持到 @angular/common@^10.0.0
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import BigNumber from 'bignumber.js';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    template: ''
})
export class CartComponent implements OnInit, OnDestroy {
    interval;
    cartItems: CartItem[] = [];
    productObjectIds: string[] = [];
    quantities: number[] = [];
    payLink: string;
    @Input() noPadding: boolean;
    Total: { currency: string, total: string }[];
    paidConfirmed: boolean;
    txid: string;
    noWallet: boolean;
    storeOwner: string;
    payQrcode: string;
    storeId: string;
    merchantId: string;
    store: any;
    currency: string;
    walletAddress: string;
    txid_link: string;
    total: number;
    tax: number;
    taxRate: number;
    wallets: any;
    wallet: any;
    modalRef: BsModalRef;
    trans_code: string;
    smartContractAddress: string;
    orderId: string;  // 订单 no
    order: any;  // 订单
    disableButton: boolean;
    errMsg = '';

    constructor(
        private modalService: BsModalService,
        private utilServ: UtilService,
        private cartStoreServ: CartStoreService,
        private orderServ: OrderService,
        private router: Router,
        // private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private dataServ: DataService,
        private iddockServ: IddockService,
        private translateServ: TranslateService,
        private coinServ: CoinService,
        private kanbanServ: KanbanService,
        private kanbanSmartContractServ: KanbanSmartContractService) {
    }

    calculateTotal(): void {
        let subtotal = 0;
        let tax = 0;

        for(let i = 0; i < this.cartItems.length; i++) {
            const item = this.cartItems[i];
            const value = item.price * item.quantity;
            subtotal += Number(value.toFixed(2));
            tax += Number((value * item.taxRate / 100).toFixed(2));
        }
        this.tax = Number(tax.toFixed(2));  // 小数留位
        this.total = Number(subtotal.toFixed(2));
        console.log('cartItems===', this.cartItems);
    }

    ngOnInit(): void {
        // this.dataServ.currentWallet.subscribe(
        //     (wallet: any) => {
        //         if(wallet) {
        //             this.wallet = wallet;
        //         }
        //     }
        // );
        // this.dataServ.currentWalletAddress.subscribe(
        //     (walletAddress: string) => {
        //         if(walletAddress) {
        //             this.walletAddress = walletAddress;
        //             // Memo: this.currency 通过 store.coin 获得
        //             // Memo: this.order 通过 getOrderId... 获得
        //             // // "/:pageSize/:pageNum" = '/100/0' 也是够用
        //             // this.orderServ.getMyOrders(walletAddress).subscribe(
        //             //     (res: any) => {
        //             //         console.log("[Orders]=", res);
        //             //         // let res2 = [];
        //             //         if (Array.isArray(res)) {  // 数组确认
        //             //             let now = new Date();
        //             //             for (let i = 0; i < res.length; i ++) {  // 数组遍历
        //             //                 const order = res[i];
        //             //                 if (order 
        //             //                 &&  order.externalOrderNumber
        //             //                 &&  order.paymentStatus == 0) {  // 'waiting for pay'
        //             //                     let time = new Date(order.dateCreated);
        //             //                     if (now.getTime() - time.getTime() < 24 * 3600 * 1000) {  // 24 小时
        //             //                         const num = order.externalOrderNumber.match(/\((.*)\)/);  // \( \) 转义符
        //             //                         // console.log('num match=', num);
        //             //                         // [
        //             //                         //     "(8)",
        //             //                         //     "8"
        //             //                         // ]
        //             //                         if (num && num[1] && num[1] == String(this.tableNo)) {  // 还要对上桌号
        //             //                             // res2.unshift(res[i]);  // 增添元素
        //             //                             this.order = order;  // 找到订单
        //             //                             // this.orderId = this.order._id;
        //             //                             console.log('this.order=', this.order);
        //             //                             this.currency = this.order.currency;
        //             //                             this.calculateTotal();
        //             //                             break;
        //             //                         }
        //             //                     }
        //             //                 }
        //             //             }
        //             //         }
        //             //     }
        //             // ); 
        //         }
        //     }
        // );

        // this.dataServ.currentStore.subscribe(
        //     (store: any) => {
        //         if(store) {
        //             this.currency = store.coin;
        //             this.storeId = store._id;  // 返回“商家页” products-grid
        //             this.merchantId = store.id;  // 小心名字看错
        //             this.taxRate = store.taxRate;
        //             this.storeOwner = store.owner;
        //             const storedCart = this.cartStoreServ.items;
        //             console.log("storeId=", this.storeId);
        //             console.log("merchantId=", this.merchantId);
        //             console.log("storedCart=", storedCart);
        //             this.cartItems = storedCart ? storedCart.filter((item) => item.storeId == this.storeId) : [];
        //             this.calculateTotal();
        //         }
        //     }
        // );
        const storedCart = this.cartStoreServ.items;
        console.log("storedCart=", storedCart);
        // this.cartItems = storedCart ? storedCart.filter((item) => item.storeId == this.storeId) : [];
        this.cartItems = storedCart;  // 取消 storeId，不需 filter
        this.calculateTotal();

        if (this.total > 0) {
            this.disableButton = false;  // 取消 Disable
        } else {
            this.disableButton = true;
        }

        this.orderId = this.cartStoreServ.getOrderId();  // 订单号  // 返回时要用到

        // // 这块可以放 CheckOut，为测试方便，先放在这里
        // this.orderId = this.cartStoreServ.getOrderId();  // 订单 no
        // if (this.orderId) {
        //     this.orderServ.get(this.orderId).subscribe(  // 获取订单对象
        //         (res: any) => {
        //             // console.log('order ret=', res);
        //             if (res) {  //  && res.ok
        //                 this.order = res;  // res._body
        //                 console.log('order ret=', this.order);
        //             }
        //         }
        //     );
        // }

    }

    checkout() {
        this.calculateTotal();

        if (this.total <= 0) {  // Fix: 价格为 0 处理
            return;
        }

        const items = [];
        // this.quantities = [];
        this.cartItems.forEach( item => {
            console.log('item=', item);
            // this.quantities.push(item.quantity);
            const titleTran = this.translateServ.transField(item.title);
            item.title = titleTran ? titleTran : item.title;
            const data: any = {  // 订单产品
                pid: item.productId,
                title: item.title,
                flavor: item.color ? item.color : '',
                size: item.size ? item.size : '',
                price: item.price,
                taxRate: item.taxRate,
                quantity: item.quantity,
                flag: 1  // 下单
            };
            items.push(data);
        });
        console.log('items==>', items);
    
        const orderId = this.cartStoreServ.getOrderId();  // 订单号
        if (orderId) {
            this.orderServ.getOrderInfo( orderId ).subscribe(
                (res: any) => {
                    if (res && res.status == 200 && res.data) {
                        const order = res.data;
                        // console.log('orderyyy=', order);

                        // let currency = this.currency;
                        if (order.idExt
                        &&  order.status >= 0) {  // -1 已经支付，不可修改
                            let times = order.status;
                            times ++;  // 下单次数

                            const items2 = order.items;  // 旧的订单商品
                            const items3 = items2.concat(items);  // 合并新的商品

                            const data: any = {  // 修改订单
                                idExt: order.idExt,
                                total: this.total + this.tax,  // 金额 + 税
                                subtotal: this.total,  // 金额
                                tax: this.tax,  // 税
                                items: items3,
                                status: times,
                            };
                            console.log('updateOrder=', data);

                            this.orderServ.updateOrder(data).subscribe(
                                (res: any) => {
                                    console.log('res=', res);
                                    if (res && res.status == 200 && res.data) {

                                        this.cartStoreServ.empty();
                                        this.router.navigate(['/store/order2']);
                                    }
                                }
                            );
                        }
                    }
                }
            );
        }

        // if (!this.wallet || !this.wallet.pwdHash) {
        //     this.router.navigate(['/wallet']);
        //     return;
        // }

        // const initialState = {
        //     pwdHash: this.wallet.pwdHash,
        //     encryptedSeed: this.wallet.encryptedSeed
        // };        

        // this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

        // this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        //     // this.spinner.show();
        //     this.checkoutDo(seed);
        // });
    }

    // async checkoutDo( seed: Buffer ) {
    //     const items: CartItem[] = [];
    //     this.quantities = [];

    //     const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    //     const privateKey = keyPair.privateKeyBuffer.privateKey;
        
    //     this.cartItems.forEach(item => {
    //         console.log('item=', item);
    //         this.quantities.push(item.quantity);

    //         const titleTran = this.translateServ.transField(item.title);
    //         item.title = titleTran ? titleTran : item.title;
    //         if (item.color && item.color.length > 0) {
    //             item.title += `, ${item.color}`;  // 口味
    //         }
    //         if (item.size && item.size.length > 0) {
    //             item.title += `, ${item.size}`;  // 尺寸
    //         }
    //         item.lockedDays = 1;  // 下单
    //         items.push(item);
    //     });

    //     const orderId = this.cartStoreServ.getOrderId();  // 订单 no
    //     if (orderId) {
    //         this.orderServ.get(orderId).subscribe(  // 获取最新数据
    //             (res: any) => {
    //                 // console.log('order ret=', res);
    //                 if (res) {  //  && res.ok
    //                     const order = res;  // res._body
    //                     // console.log('order ret=', this.order);

    //                     let currency = this.currency;
    //                     if (order.externalOrderNumber
    //                     &&  order.merchantId == this.merchantId
    //                 // &&  order.owner == this.walletAddress  // Memo: 是后台创建的订单
    //                     &&  order.memo != 'PayBill') {  // 已经支付，不可修改
    //                         // const orderData = { merchantId: this.merchantId, owner: this.walletAddress, items, currency };
    //                         // console.log('orderData2=', orderData);
                
    //                         let times = 1;
    //                         if (order.memo) {
    //                             const num = order.memo.match(/PlaceOrder(.*)/);  // \( \) 转义符
    //                             console.log('num match=', num);
    //                             // [
    //                             //     "PlaceOrder1",
    //                             //     "1"
    //                             // ]
    //                             if (num && num[1]) {  // 下单次数
    //                                 times = parseInt(num[1]);
    //                                 times ++;
    //                             }
    //                         }
    //                         const memo = `PlaceOrder${times}`;
                
    //                         const items2 = order.items;  // 旧的订单商品
    //                         const items3 = items2.concat(items);  // 合并新的商品
    //                         const updated = {
    //                             items: items3,
    //                             memo: memo
    //                         };
    //                         const sig = this.kanbanServ.signJsonData(privateKey, updated);
    //                         updated['sig'] = sig.signature;  
    //                         // console.log('[combine] orderId=', orderId);
    //                         // console.log('[combine] externalOrderNumber=', order.externalOrderNumber);
    //                         // console.log('[combine] updated=', updated);
    //                         this.orderServ.update_items(order.externalOrderNumber, updated).subscribe(  // Order 增添数据
    //                             (res: any) => {
    //                                 if (res) {
    //                                     const body = res;
    //                                     const orderNewID = body._id;
    //                                     // this.spinner.hide();
    //                                     this.cartStoreServ.empty();
    //                                     // console.log('tableno=', this.tableNo, this.cartStoreServ.getTableNo());
    //                                     if (this.cartStoreServ.getTableNo() > 0) {  // 台号 no 存在
    //                                         // 点餐现场，不需要地址。点餐之后进入订单页
    //                                     // this.router.navigate(['/store/'+ this.storeId + '/payment/' + orderNewID]);  // 进入支付
    //                                         this.router.navigate(['/store/' + this.storeId + '/order']);
                
    //                                     } else {
    //                                         // 网上点餐，我们暂不在此实现
    //                                         // // console.log('goto=', '/store/', this.storeId, '/address/', orderNewID);
    //                                         // this.router.navigate(['/store/' + this.storeId + '/address/' + orderNewID]);  // 地址页
    //                                     }
    //                                 }
    //                             },
    //                             err => { 
    //                                 this.errMsg = err.message;
    //                                 // this.spinner.hide();
    //                                 this.toastr.error('error while combining order');              
    //                             }
    //                         );  
    //                     }
                
    //                     // 新的订单，改在后台创建

    //                     // } else {    // 新的订单

    //                     //     const uuid = uuidv4();  // '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    //                     //     let uuid2 = uuid.replace(/-/g, '');  // 去掉 - 字符
    //                     //     if (this.cartStoreServ.getTableNo() > 0) {  // 台号 no 存在
    //                     //         const no = this.cartStoreServ.getTableNo();
    //                     //         uuid2 = `${uuid2}(${no})`;  // 加入台号
    //                     //     }
    //                     //     const orderData = { merchantId: this.merchantId, owner: this.walletAddress, items, currency, externalOrderNumber: uuid2 };
    //                     //     console.log('orderData=', orderData);
    //                     //     // owner: { type: String},
    //                     //     // totalAmount: {type: Number},
    //                     //     // totalTax: {type: Number},
    //                     //     // totalShipping: {type: Number},
    //                     //     // currency: {type: String, required: true},
    //                     //     // merchantId: {type: String, required: true},
    //                     //     // items: [{
    //                     //     //     title: String,
    //                     //     //     taxRate: Number,
    //                     //     //     lockedDays: Number,
    //                     //     //     rebateRate: Number,
    //                     //     //     price: Number,
    //                     //     //     quantity: Number
    //                     //     // }], 
    //                     //     const sig = this.kanbanServ.signJsonData(privateKey, orderData);
    //                     //     orderData['sig'] = sig.signature;  
    //                     //     this.orderServ.create2(orderData).subscribe(
    //                     //         (res: any) => {
    //                     //             if (res) {
    //                     //                 const body = res;
    //                     //                 const orderNewID = body._id;
    //                     //                 this.spinner.hide();
    //                     //                 this.cartStoreServ.empty();
    //                     //                 console.log('tableno=', this.tableNo, this.cartStoreServ.getTableNo());
    //                     //                 if (this.cartStoreServ.getTableNo() > 0) {  // 台号 no 存在
    //                     //                     // 点餐现场，不需要地址。点餐之后进入订单页
    //                     //                 // this.router.navigate(['/store/'+ this.storeId + '/payment/' + orderNewID]);  // 进入支付
    //                     //                     this.router.navigate(['/store/' + this.storeId + '/order']);

    //                     //                 } else {
    //                     //                     // 网上点餐，我们暂不在此实现
    //                     //                     // // console.log('goto=', '/store/', this.storeId, '/address/', orderNewID);
    //                     //                     // this.router.navigate(['/store/' + this.storeId + '/address/' + orderNewID]);  // 地址页
    //                     //                 }
    //                     //             }
    //                     //         },
    //                     //         err => { 
    //                     //             this.errMsg = err.message;
    //                     //             this.spinner.hide();
    //                     //             this.toastr.error('error while creating order');              
    //                     //         }
    //                     //     );  
    //                     // }

    //                 // (await this.iddockServ.addIdDock(seed, 'things', null, orderData, null)).subscribe( async res => {
    //                 //   if(res) {
    //                 //     if(res.ok) {
    //                 //       console.log('res._body=', res._body);
    //                 //       const objectId = this.utilServ.sequenceId2ObjectId(res._body._id.substring(0, 60));
    //                 //       orderData['objectId'] = objectId; 
    //                 //       const sig = this.kanbanServ.signJsonData(privateKey, orderData);
    //                 //       orderData['sig'] = sig.signature;               
    //                 //     }
    //                 //     else {
    //                 //       this.spinner.hide();
    //                 //       this.toastr.error('error while saving to iddock');
    //                 //     }
    //                 //   }});
    //                 }
    //             }
    //         );
    //     }
    // }

    clear() {
        this.cartItems = [];
        this.cartStoreServ.empty();
    }

    updateProduct(item) {
        console.log('this.images3');
        const product = item.product;
        const quantity = item.quantity;
        const productId = product.productId;
        if (quantity === 0) {
        this.cartItems = this.cartItems.filter((itm) => itm.productId !== productId);
        } else {
        for (let i = 0; i < this.cartItems.length; i++) {
            if (this.cartItems[i].productId === productId) {
            this.cartItems[i].quantity = quantity;
            }
        }
        }
        this.cartStoreServ.saveCartItems(this.cartItems);
        this.calculateTotal();
    }

    pauseTimer(): void {
        if (this.interval) {
        clearInterval(this.interval);
        }

    }

    calcTotal() {
        return this.cartItems.reduce(
        (acc, prod) => acc += prod.quantity, 0
        );
    }

    ngOnDestroy(): void {
        this.pauseTimer();
    }
}
