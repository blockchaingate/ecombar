
import { Component, Input, OnInit } from '@angular/core';
import { CartStoreService } from '../../services/cart.store.service';
import { FavoriteService } from 'src/app/modules/shared/services/favorite.service';
import { CartItem } from '../../models/cart-item';
import { environment } from '../../../../../environments/environment';
import { DataService } from '../../services/data.service';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';    // 台号 no
import { OrderService } from 'src/app/modules/shared/services/order.service';

@Component({
    selector: 'app-products-grid',
    templateUrl: './products-grid.component.html',
    styleUrls: [
        './products-grid.component.scss',
        '../../../../../page.scss'
    ]
})
export class ProductsGridComponent implements OnInit{
    iddockRoot: string;
    storeId: string;
    store: any;
    categories: any;
    currency: string;
    type: string;  // 类别（过滤） category
    orderId: string;  // 订单 no
    @Input() products: any;  // <app-products-grid [products]="latestProducts"></app-products-grid>

    constructor(
        private route: ActivatedRoute,
        private dataServ: DataService,
        private orderServ: OrderService,
        private categoryServ: CategoryService, 
        private favoriteServ: FavoriteService,
        private cartStoreServ: CartStoreService) {
        this.iddockRoot = environment['IDDOCK'];
    }

    ngOnInit() {
        // this.dataServ.currentStore.subscribe(
        //     (store: any) => {
        //         console.log('storeeeee=', store);
        //         this.storeId = store._id;
        //         this.store = store;
        //         this.currency = store.coin;
        //     }
        // );
        // this.dataServ.currentStoreOwner.subscribe(
        //     (storeOwner: string) => {
        //         if(storeOwner) {
        //             this.categoryServ.getMerchantCategoriesTree(storeOwner).subscribe(
        //                 (ret: any) => {
        //                     if(ret) {
        //                         console.log('ret of categories=', ret);
        //                         const allCategories = ret;
        //                         this.categories = allCategories;
        //                         this.dataServ.changeStoreCategories(allCategories);
        //                     }
        //                 }
        //             );
        //         }
        //     }
        // );
        this.categories = [];
        this.categoryServ.getCategoryList().subscribe(
            (res: any) => {
                if (res && res.status == 200 && res.data) {
                    console.log("categories=", res.data);
                    this.categories = res.data;
                }
            }
        );

        this.route.paramMap.subscribe((params: ParamMap) =>  {
            if (params.get('orderId')) {
                this.orderId = params.get('orderId');  // 订单 no
                this.cartStoreServ.setOrderId(this.orderId);  // 订单 no
                console.log('orderId=', this.cartStoreServ.getOrderId());
    
                this.type = params.get('type');  // 类别（过滤）
                console.log('typeno=', this.type);

                this.orderServ.getOrderInfo(this.orderId).subscribe(
                    (res: any) => {
                        if (res && res.status == 200 && res.data) {
                            const order = res.data;
                            console.log('orderyyy=', order);
                            const tableNo = order.table;  // 台号 no
                            this.cartStoreServ.setTableNo(tableNo);  // 台号 no
                            console.log('tableNo=', tableNo);
                        }
                    }
                );
                // this.orderServ.get(this.orderId).subscribe(  // 通过订单号，运算出台号
                //     (res: any) => {
                //         // console.log('order ret=', res);
                //         if (res) {  //  && res.ok
                //             // this.order = res;  // res._body
                //             // console.log('order ret=', this.order);
                //             const order = res;
                //             if (order && order.externalOrderNumber) {
                //                 const num = order.externalOrderNumber.match(/\((.*)\)/);  // \( \) 转义符
                //                 // console.log('num match=', num);
                //                 // [
                //                 //     "(8)",
                //                 //     "8"
                //                 // ]
                //                 if (num && num[1]) {  // 查到台号
                //                     const tableNo = parseInt(num[1]);  // 台号 no (计算)
                //                     this.cartStoreServ.setTableNo(tableNo);  // 台号 no
                //                 }
                //             }
                //         }
                //     }
                // );
    
            }



        });
    }

    addToCart( item: any ) {
        console.log('addToCart gogo1');
        const cartItem: CartItem = {  // 取消 rebateRate, lockedDays, storeId, currency
            productId: item.id,  // item._id
            objectId: item.objectId,
            title: item.title,
            price: item.price,
            rebateRate: 0,  // item.rebateRate ? item.rebateRate : this.store.rebateRate,
            taxRate: item.taxRate ? item.taxRate : 0,  // item.taxRate ? item.taxRate : this.store.taxRate,
            lockedDays: 0,  // item.lockedDays ? item.lockedDays : this.store.lockedDays,
            storeId: null,  // this.storeId,
            currency: null,  // item.currency,
            thumbnailUrl: item.images ? item.images[0] : null,
            quantity: 1
        };
        this.cartStoreServ.addCartItem(cartItem);
    }

    addFavorite(item: any) {
        const data = {
            parentId: item._id
        };
        this.favoriteServ.create(data).subscribe(
            (res: any) => {
                if(res && res.ok) {
                    console.log('gogogo');
                }
            }
        );
    }
}


