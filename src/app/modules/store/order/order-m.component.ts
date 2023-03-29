
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
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import BigNumber from 'bignumber.js';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { ActivatedRoute } from '@angular/router';
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';
import { environment } from '../../../../environments/environment';

@Component({
    template:''
})
export class OrderMerchantComponent implements OnInit {
    orderId: string;
    order: any;
    // id: string;
    storeId: string;
    shippingFee: number;  // 没用上
    subtotal: number;
    total: number;
    currency: string;
    wallet: any;
    walletAddress: string;
    modalRef: BsModalRef;
    tax: number;
    taxRate: number;
    tableNo: number;  // 台号 no (计算)
    diffFlag: number;  // 已是最新(1 下单, 2 支付)，不是最新(3 下单, 4 支付)
    QrUrl: string;  // 二维码地址
    errMsg = '';
    
    constructor(
        private route: ActivatedRoute, 
        private modalService: BsModalService,
        private utilServ: UtilService,
        private cartStoreServ: CartStoreService,
        private merchantServ: MerchantService,
        private orderServ: OrderService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private dataServ: DataService,
        private iddockServ: IddockService,
        private translateServ: TranslateService,
        private coinServ: CoinService,
        private kanbanServ: KanbanService,
        private kanbanSmartContractServ: KanbanSmartContractService) {
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
            (walletAddress: any) => {
                if(walletAddress) {
                    this.walletAddress = walletAddress;
                }
            }
        );

        this.orderId = this.route.snapshot.paramMap.get('id');
        // console.log('[OrderComponent]', this.orderId);
        this.dataServ.currentMyStore.subscribe(
            (store: any) => {
                if(store) {
                    this.storeId = store._id;
                    console.log('store===', store);
                    this.updateOrderData();  // 更新“后台订单查看”
                }
            }
        );
    
    }

    // 更新“后台订单查看”（即时刷新）
    updateOrderData() {
        if (this.orderId) {
            this.orderServ.get(this.orderId).subscribe(
                (res: any) => {
                    // console.log('this.order ret=', res);
                    if (res) {  //  && res.ok
                    this.order = res;  // res._body
                    console.log('this.order=', this.order);
                    // 初始化数据
                    this.currency = this.order.currency;
                    // this.selectPayment(this.order.paymentMethod);
                    // this.selectShippingService(this.order.shippingServiceSelected);
                    this.calculateTotal();

                    const order = this.order;
                    if (order && order.externalOrderNumber) {
                        const num = order.externalOrderNumber.match(/\((.*)\)/);  // \( \) 转义符
                        // console.log('num match=', num);
                        // [
                        //     "(8)",
                        //     "8"
                        // ]
                        if (num && num[1]) {  // 要有台号
                            this.tableNo = parseInt(num[1]);  // 台号 no (计算)

                            // 判断与记录的差异
                            const tableOrder = this.merchantServ.getTableOrder(num[1]);
                            // console.log("[tableOrder]=", tableOrder);
                            const diff = this.CompareOrders(order, tableOrder);
                            if (! diff) {  // 不同
                                if (order.memo == 'PayBill') {  // 改为修改 memo
                            // if (order.paymentStatus == 2) {  // 'payment confirmed'
                                    this.diffFlag = 4;
                                } else {
                                    this.diffFlag = 3;
                                }
                            } else {  // 相同
                                if (order.memo == 'PayBill') {
                                    this.diffFlag = 2;
                                } else {
                                    this.diffFlag = 1;
                                }
                            }
                            this.QrUrl = environment.EX_WEBSITE + `store/${this.storeId}/order/${this.orderId}`;
                        }
                    }
                }
            });
        }
    }

    CompareOrders( order: any, order2: any ) {
        if (!order && !order2) return true;  // 两个都为空
        if (!order || !order2) return false;  // 任一个为空

        if (order["_id"] != order2["_id"]) return false;
        if (order["owner"] != order2["owner"]) return false;
        if (order["totalTax"] != order2["totalTax"]) return false;
        // if (order["totalShipping"] != order2["totalShipping"]) return false;
        if (order["totalAmount"] != order2["totalAmount"]) return false;
        if (order["paymentStatus"] != order2["paymentStatus"]) return false;

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

    calculateTotal() {
        this.subtotal = 0;
        this.total = 0;
        this.shippingFee = 0;  // 没用上
        if (!this.order || !this.order.items || (this.order.items.length == 0)) {
            return;
        }
        let subtotalBigNumber = new BigNumber(0);
        let taxBigNumber = new BigNumber(0);
        for (let i = 0; i < this.order.items.length; i ++) {
            const item = this.order.items[i];
            console.log('item===', item);
            const price = item.price;
            const quantity = item.quantity;
            const taxRate = item.taxRate;
            const subtotalItem = new BigNumber(price).multipliedBy(new BigNumber(quantity));
            subtotalBigNumber = subtotalBigNumber.plus(subtotalItem);
            taxBigNumber = taxBigNumber.plus(subtotalItem.multipliedBy(taxRate).dividedBy(new BigNumber(100)));
        }
        this.subtotal = subtotalBigNumber.toNumber();
        this.tax = taxBigNumber.toNumber();
        this.total = subtotalBigNumber.plus(taxBigNumber).plus(new BigNumber(this.shippingFee)).toNumber();
    }
  
    placeOrder() {
        if (this.total <= 0) {
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

        this.orderServ.update2(this.orderId, updated).subscribe(
            (order) => {
                this.orderServ.getPaycoolRewardInfo(this.orderId, this.walletAddress, 'WithFee').subscribe(
                    async (ret: any) => {
                        this.order = ret;
    
                        const params = this.order.params;
                        console.log('params==', params);
                
                        ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, params[0].to, params[0].data);
                        if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
                            ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, params[1].to, params[1].data);
                            if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
                                this.spinner.hide();
                                this.toastr.success('the transaction was procssed successfully');

                                location.reload();  // 重新加载当前页面
                                // Fix: 支付后会停在此页面。改为跳去查看所有订单
                                // setTimeout( () => {
                                //     // this.router.navigate(['/account/orders']);
                                //     // http://localhost:4200/store/640f368a23979c464aa2e296/order-list
                                //     this.router.navigate(['/store/' + this.storeId + '/order-list']);
                                // }, 1000);  // 发现未更新状态，给个延时
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

    // 收到订单状态，记入最新记录
    confirmOrder() {
        if (! this.order) {
            return;
        }
        if (this.tableNo <= 0) {  // 台号 no (计算)
            return;
        }

        let data = { };
        data["_id"] = this.order["_id"];
        data["owner"] = this.order["owner"];
        data["totalTax"] = this.order["totalTax"];
        // data["totalShipping"] = this.order["totalShipping"];
        data["totalAmount"] = this.order["totalAmount"];
        data["paymentStatus"] = this.order["paymentStatus"];
        if (this.order["items"] && this.order["items"].length >= 0) {
            data["items"] = [ ];
            const size = this.order["items"].length;
            for (let i = 0; i < size; i ++) {
                data["items"].push(this.order["items"][i]["title"]);  // 增添元素(结尾)
            }
        }

        this.merchantServ.setTableOrder(String(this.tableNo), data);
        console.log('confirmOrder==', this.tableNo, data);
        // console.log('setTableOrder==', this.merchantServ.getTableOrder(String(this.tableNo)));

        location.reload();  // 重新加载当前页面
    }

    setFood( orderId: string, foodId: string, quantity: number, flag: number ) {    // set: 0 做好 1 下订
        if (quantity <= 0) {
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
            this.setFoodDo(seed, orderId, foodId, quantity, flag);
        });
    }

    async setFoodDo( seed: Buffer, orderId: string, foodId: string, quantity: number, flag: number ) {

        const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        const privateKey = keyPair.privateKeyBuffer.privateKey;

        this.orderServ.get(orderId).subscribe(  // 获取最新数据
            (res: any) => {
                // console.log('order ret=', res);
                if (res) {  //  && res.ok
                    const order = res;  // res._body
                    // const currency = order.currency;

                    if (order.externalOrderNumber
                 // &&  order.owner == this.walletAddress  // Memo: 是后台创建的订单
                 // &&  order.memo != 'PayBill'  // Memo: 不管 PayBill 情况
                    ) {
                        let items = order.items;  // 旧的订单商品
                        let memo = order.memo;
                        for (let i = 0; i < items.length; i ++) {  // 食物遍历
                            const food = items[i];
                            if (food._id == foodId && food.quantity == quantity) {  // 找到指定食物
                                if (food.lockedDays > 0 && flag <= 0) {
                                    items[i].lockedDays = 0;  // 设为做好  // 不用 food 变量
                                    break;
                                } else if (food.lockedDays <= 0 && flag > 0) {
                                    items[i].lockedDays = 1;  // 设为下订
                                    break;
                                }
                            }
                        }
                        const updated = {
                            items: items,
                            memo: memo
                        };
                        const sig = this.kanbanServ.signJsonData(privateKey, updated);
                        updated['sig'] = sig.signature;  
                        // console.log('[combine]=', this.orderId, updated);
                        this.orderServ.update_items(order.externalOrderNumber, updated).subscribe(  // Order 更新数据
                            (res: any) => {
                                if (res) {
                                    const body = res;
                                    const orderNewID = body._id;
                                    this.spinner.hide();

                                    // location.reload();  // 重新加载当前页面
                                    this.updateOrderData();  // 更新“后台订单查看”
                                }
                            },
                            err => { 
                                this.errMsg = err.message;
                                this.spinner.hide();
                                this.toastr.error('error while combining order');              
                            }
                        );  
                    }
                }
            }
        );
    }
}
