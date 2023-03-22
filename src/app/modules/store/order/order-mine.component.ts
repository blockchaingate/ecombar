
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

@Component({
    template:''
})
export class OrderMineComponent implements OnInit {
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
    tableNo: number;  // 台号 no
    
    constructor(
        private route: ActivatedRoute, 
        private modalService: BsModalService,
        private utilServ: UtilService,
        private cartStoreServ: CartStoreService,
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
        this.tableNo = this.cartStoreServ.getTableNo();  // 台号 no
        console.log('tableno=', this.tableNo);

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
                            console.log("[Orders]=", res);
                            // let res2 = [];
                            if (Array.isArray(res)) {  // 数组确认
                                let now = new Date();
                                for (let i = 0; i < res.length; i ++) {  // 数组遍历
                                    const order = res[i];
                                    if (order 
                                    &&  order.externalOrderNumber
                                    &&  order.paymentStatus == 0) {  // 'waiting for pay'
                                        let time = new Date(order.dateCreated);
                                        if (now.getTime() - time.getTime() < 24 * 3600 * 1000) {  // 24 小时
                                            const num = order.externalOrderNumber.match(/\((.*)\)/);  // \( \) 转义符
                                            // console.log('num match=', num);
                                            // [
                                            //     "(8)",
                                            //     "8"
                                            // ]
                                            if (num && num[1] && num[1] == String(this.tableNo)) {  // 还要对上桌号
                                                // res2.unshift(res[i]);  // 增添元素
                                                this.order = order;  // 找到订单
                                                this.orderId = this.order._id;
                                                console.log('this.order=', this.order);
                                                this.currency = this.order.currency;
                                                this.calculateTotal();
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ); 
                }
            }
        );
        // this.orderId = this.route.snapshot.paramMap.get('id');
        // // console.log('[OrderComponent]', this.orderId);
        // this.orderServ.get(this.orderId).subscribe(
        //     (res: any) => {
        //         // console.log('this.order ret=', res);
        //         if (res) {  //  && res.ok
        //             this.order = res;  // res._body
        //             console.log('this.order=', this.order);
        //             // 初始化数据
        //             this.currency = this.order.currency;
        //             // this.selectPayment(this.order.paymentMethod);
        //             // this.selectShippingService(this.order.shippingServiceSelected);
        //             this.calculateTotal();
        //         }
        //     }
        // );
        this.dataServ.currentStoreId.subscribe(
            (storeId: string) => {
                this.storeId = storeId;
            }
        );
        // this.dataServ.currentStore.subscribe(
        //     (store: any) => {
        //         if(store) {
        //             this.currency = store.coin;
        //             this.storeId = store._id;  // 返回“商家页” products-grid
        //             this.merchantId = store.id;  // 小心名字看错
        //             this.taxRate = store.taxRate;
        //             this.storeOwner = store.owner;
        //             const storedCart = this.cartStoreServ.items;
        //             console.log("storedCart=", storedCart);
        //             this.cartItems = storedCart ? storedCart.filter((item) => item.storeId == this.merchantId) : [];  // Fix: this.storeId 用错
        //             this.calculateTotal();
        //         }
        //     }
        // );
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
        if (this.total <= 0) {  // Fix: 价格为 0 处理
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
                                // Fix: 支付后会停在此页面。改为跳去查看所有订单
                                setInterval( () => {
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
}
