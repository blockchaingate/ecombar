
import { IonContent } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';

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
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';

import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-admin-food-list',
    providers: [OrderService],
    templateUrl: './food-list.component.html',
    styleUrls: [
        './food-list.component.scss', 
        '../../../../../page.scss'
    ]
})
export class FoodListComponent implements OnInit {
    @ViewChild(IonContent) content: IonContent;
    orders: any;
    order: any;
    wallet: any;
    walletAddress: any;
    foodData: any;
    modalRef: BsModalRef;
    errMsg = '';

    constructor(
        public kanbanServ: KanbanService,
        private route: ActivatedRoute,
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
        this.route.paramMap.subscribe(
            (params: ParamMap) => {
                const host = params.get('hostUrl');  // 选择“后端 API”
                console.log('hostttt===', host);
                if (!host || host == '') {
                 // environment.endpoints['madeat'] = 'http://localhost:6060/';
                } else {
                    environment.endpoints['madeat'] = `http://${host}/`;
                }
                // console.log('hostttt>>>', environment.endpoints['madeat']);

                // this.dataServ.currentWallet.subscribe(
                //     (wallet: any) => {
                //         this.wallet = wallet;
                //     }
                // ); 

                this.foodData = [ ];
                // this.dataServ.currentWalletAddress.subscribe(
                //     (walletAddress: string) => {
                //         if(walletAddress) {
                //             this.walletAddress = walletAddress;
                //             this.updateFoodData();  // 更新“厨师制作清单”
                //         }
                //     }
                // );
                this.updateFoodData();  // 更新“厨师制作清单”

                setInterval(() => {
                    // location.reload();
                    this.updateFoodData();  // 更新“厨师制作清单”
                }, 60 * 1000); // 重新加载当前页面，间隔 60 秒
            }
        );
    }

    // 更新“厨师制作清单”（即时刷新）
    updateFoodData() {
        this.foodData = [ ];
        this.orderServ.getOrderList().subscribe(  // 之后加入 status 限制
            (res: any) => {
                if (res && res.status == 200 && res.data) {
                    console.log("orders=", res.data);
                    const orderlist = res.data;
                    // this.orders = res.data;

                    if (Array.isArray(orderlist)) {  // 数组确认
                        let data = [ ];
                        const now = new Date();
                        for (let i = 0; i < orderlist.length; i ++) {  // 数组遍历（找出合适的）
                            const order = orderlist[i];
                            if (! order) continue;
                            const time = new Date(order.dateCreated);
                            // if (now.getTime() - time.getTime() < 2 * 24 * 3600 * 1000) {  // 24 小时 * 2
                                // if (! order.owner) continue;  // 商家开的单，没有 owner
                                // if (order.memo == 'PayBill') continue;  // 先买单了，菜要继续
                                if (order && order.idExt) {
                                    data.push(order);  // 增添元素(结尾)
                                }
                            // }
                        }
                        console.log("orders(fix)=", data);
                        for (let i = 0; i < data.length; i ++) {  // 数组遍历
                            const order = data[i];
                            const items = order.items;
                            for (let j = 0; j < items.length; j ++) {  // 食物遍历
                                if (items[j].flag <= 0) continue;  // 已经上菜？
                                let food = { };
                                food['tableNo'] = order.table;
                                food['orderId'] = order.id;
                                food['num'] = j + 1;
                                food['create'] = order.create;
                                food['pid'] = items[j].pid;
                                food['title'] = items[j].title;
                                food['flavor'] = items[j].flavor;
                                food['size'] = items[j].size;
                                let desc = [];
                                if (items[j].flavor && items[j].flavor != '') {
                                    desc.push(items[j].flavor);
                                }
                                if (items[j].size && items[j].size != '') {
                                    desc.push(items[j].size);
                                }
                                if (desc.length > 0) {
                                    const text = desc.join(', ');
                                    food['title'] = items[j].title + ` (${text})`;
                                }
                                food['price'] = items[j].price;
                                food['quantity'] = items[j].quantity;
                                this.foodData.push(food);  // 增添元素(结尾)
                            }
                        }
                        this.orders = data;
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
        //                 console.log("[Orders]=", res);
        //                 if (Array.isArray(res)) {  // 数组确认
        //                     let data = [ ];
        //                     const now = new Date();
        //                     for (let i = 0; i < res.length; i ++) {  // 数组遍历
        //                         let order = res[i];
        //                         if (! order) continue;
        //                         const time = new Date(order.dateCreated);
        //                         // if (now.getTime() - time.getTime() < 2 * 24 * 3600 * 1000) {  // 24 小时 * 2
        //                             // if (! order.owner) continue;  // 商家开的单，没有 owner
        //                             // if (order.memo == 'PayBill') continue;  // 先买单了，菜要继续
        //                             if (order && order.externalOrderNumber) {
        //                                 const num = order.externalOrderNumber.match(/\((.*)\)/);  // \( \) 转义符
        //                                 // console.log('num match=', num);
        //                                 // [
        //                                 //     "(8)",
        //                                 //     "8"
        //                                 // ]
        //                                 if (num && num[1]) {  // 要有台号
        //                                     order["tableNo"] = num[1];  // 台号 no (计算)
        //                                     data.push(order);  // 增添元素(结尾)
        //                                 } else {
        //                                     continue;
        //                                 }
        //                             } else {
        //                                 continue;
        //                             }
        //                         // }
        //                     }
        //                     console.log("[orderData]=", data);
        //                     for (let i = 0; i < data.length; i ++) {  // 数组遍历
        //                         const order = data[i];
        //                         const items = order.items;
        //                         for (let j = 0; j < items.length; j ++) {  // 食物遍历
        //                             if (items[j].lockedDays <= 0) continue;  // 已经上菜？
        //                             let food = { };
        //                             food['tableNo'] = order.tableNo;
        //                             food['orderId'] = order._id;
        //                             food['num'] = j + 1;
        //                             food['merchantId'] = order.merchantId;
        //                             food['dateCreated'] = order.dateCreated;
        //                             food['title'] = items[j].title;
        //                             food['price'] = items[j].price;
        //                             food['quantity'] = items[j].quantity;
        //                             food['food'] = items[j]._id;
        //                             this.foodData.push(food);  // 增添元素(结尾)
        //                         }
        //                     }
        //                     this.orders = data;
        //                 }
        //             }
        //         }
        //     );
        // }
    }

    trimText( id:string ) {    // 地址不长，不用此函数，用户可复制地址
     // return id.substring(0, 4) + '..' + id.substring(id.length - 4);
        return id.substring(id.length - 4);
    }

    removeFood( orderId: string, foodId: string, foodFlavor: string, foodSize: string, quantity: number ) {
        if (quantity <= 0) {
            return;
        }

        this.orderServ.getOrderInfo( orderId ).subscribe(
            (res: any) => {
                if (res && res.status == 200 && res.data) {
                    const order = res.data;
                    // console.log('orderyyy=', order);

                    if (order.idExt
                    // &&  order.status >= 0  // 不管 PayBill 情况
                    ) {
                        let items = order.items;  // 旧的订单商品
                        for (let i = 0; i < items.length; i ++) {  // 食物遍历
                            const food = items[i];
                            if (food.pid == foodId && food.flavor == foodFlavor && food.size == foodSize 
                                &&  food.quantity == quantity && food.flag > 0) {  // 找到指定食物
                                items[i].flag = 0;  // 设为做好  // 不用 food 变量
                                break;
                            }
                        }
                        const data: any = {  // 修改订单
                            idExt: order.idExt,
                            total: order.total, 
                            subtotal: order.subtotal,
                            tax: order.tax, 
                            items: items,
                            status: order.status,
                        };
                        console.log('updateOrder=', data);

                        this.orderServ.updateOrder(data).subscribe(
                            (res: any) => {
                                console.log('res=', res);
                                if (res && res.status == 200 && res.data) {

                                    this.updateFoodData();  // 更新“厨师制作清单”
                                }
                            }
                        );
                    }
                }
            }
        );

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
        //     this.removeFoodDo(seed, orderId, foodId, quantity);
        // });
    }

    // async removeFoodDo( seed: Buffer, orderId: string, foodId: string, quantity: number ) {

    //     const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    //     const privateKey = keyPair.privateKeyBuffer.privateKey;

    //     this.orderServ.get(orderId).subscribe(  // 获取最新数据
    //         (res: any) => {
    //             // console.log('order ret=', res);
    //             if (res) {  //  && res.ok
    //                 const order = res;  // res._body
    //                 // const currency = order.currency;

    //                 if (order.externalOrderNumber
    //              // &&  order.owner == this.walletAddress  // Memo: 是后台创建的订单
    //              // &&  order.memo != 'PayBill'  // Memo: 不管 PayBill 情况
    //                 ) {
    //                     let items = order.items;  // 旧的订单商品
    //                     let memo = order.memo;
    //                     for (let i = 0; i < items.length; i ++) {  // 食物遍历
    //                         const food = items[i];
    //                         if (food._id == foodId && food.quantity == quantity && food.lockedDays > 0) {  // 找到指定食物
    //                             items[i].lockedDays = 0;  // 设为做好  // 不用 food 变量
    //                             break;
    //                         }
    //                     }
    //                     const updated = {
    //                         items: items,
    //                         memo: memo
    //                     };
    //                     const sig = this.kanbanServ.signJsonData(privateKey, updated);
    //                     updated['sig'] = sig.signature;  
    //                     // console.log('[combine]=', this.orderId, updated);
    //                     this.orderServ.update_items(order.externalOrderNumber, updated).subscribe(  // Order 更新数据
    //                         (res: any) => {
    //                             if (res) {
    //                                 const body = res;
    //                                 const orderNewID = body._id;
    //                                 // this.spinner.hide();

    //                                 // location.reload();  // 重新加载当前页面
    //                                 this.updateFoodData();  // 更新“厨师制作清单”
    //                             }
    //                         },
    //                         err => { 
    //                             this.errMsg = err.message;
    //                             // this.spinner.hide();
    //                             this.toastr.error('error while combining order');              
    //                         }
    //                     );  
    //                 }
    //             }
    //         }
    //     );
    // }

    scrollToTop() {
        this.content.scrollToTop();
    }

}
