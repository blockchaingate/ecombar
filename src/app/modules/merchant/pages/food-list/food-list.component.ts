
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
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';

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

    }

    trimText( id:string ) {    // 地址不长，不用此函数，用户可复制地址
     // return id.substring(0, 4) + '..' + id.substring(id.length - 4);
        return id.substring(id.length - 4);
    }

    removeFood( orderId: string, foodId: string, foodTitle: string, quantity: number ) {
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
                            if (food.pid == foodId && food.title == foodTitle && food.quantity == quantity && food.flag > 0) {  // 找到指定食物
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
    }

    scrollToTop() {
        this.content.scrollToTop();
    }

}
