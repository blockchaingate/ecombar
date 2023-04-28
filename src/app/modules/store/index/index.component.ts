
import { Component, OnInit } from '@angular/core';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { MainLayoutService } from 'src/app/modules/shared/services/mainlayout.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { Product } from 'src/app/modules/shared/models/product';
import { TopCategoryBannerService } from 'src/app/modules/shared/services/top-category-banner.service';

import { environment } from '../../../../environments/environment';

@Component({
    template: ''
})
export class IndexComponent implements OnInit{
    categories: any;
    mainLayouts: any;
    latestProducts: any;
    banners: any;
    constructor(
        private categoryServ: CategoryService,
        private route: ActivatedRoute,
        private mainLayoutServ: MainLayoutService,
        private bannerServ: TopCategoryBannerService,
        private cartStoreServ: CartStoreService,
        private productServ: ProductService) {
    }
    ngOnInit() {
        this.route.paramMap.subscribe(
            (params: ParamMap) => {
                // const storeId = params.get('storeId');
                // console.log('storeId===', storeId);

                // this.mainLayoutServ.getMerchantMainLayouts(storeId, 100, 0).subscribe(
                //     (ret: any) => {
                //         if(ret) {
                //             this.mainLayouts = ret;
                //         }
                //     }
                // );
                const host = params.get('hostUrl');  // 选择“后端 API”
                console.log('hostttt===', host);
                if (!host || host == '') {
                 // environment.endpoints['madeat'] = 'http://localhost:6060/';
                } else {
                    this.cartStoreServ.setApiHost(host);
                    // environment.endpoints['madeat'] = `http://${host}/`;
                }
                // console.log('hostttt>>>', environment.endpoints['madeat']);

                const type = params.get('type');  // 选择“产品类型”
                console.log('typeeee===', type);

                // this.productServ.getMerchantProducts(storeId, 100, 0).subscribe(
                //   (ret: any) => {
                //     this.latestProducts = ret;
                //     console.log('latestProducts===', this.latestProducts);
                //   }            
                // );
                this.productServ.getProductList().subscribe(
                    (res: any) => {
                        if (res && res.status == 200 && res.data) {
                            console.log("latestProducts=", res.data);
                            const products = res.data;
                            if (!type || type == '') {  // ALL 的情况
                                this.latestProducts = res.data;
                            } else {
                                this.latestProducts = [];
                                for (const product of products) {  // 按 type 来挑选
                                    if (product.category == type) {
                                        this.latestProducts.push(product);
                                    }
                                }
                            }
                        }
                    }
                );

                // this.bannerServ.getMerchantBanners(storeId, 100, 0).subscribe(
                //     (ret: any) => {
                //         if(ret) {
                //         this.banners = ret._body;
                //         }
                //     }
                // );

                // this.categoryServ.getMerchantHotCategories(storeId, 100, 0).subscribe(
                //     (res: any) => {
                //         if(res) {
                //         this.categories = res._body;
                //         }
                //     }
                // );
            }
        );

        // this.dataServ.currentStoreOwner.subscribe(
        //     (storeOwner: string) => {
        //         console.log('storeOwner======', storeOwner);
        //         if(storeOwner) {
        //             this.mainLayoutServ.getMerchantMainLayouts(storeOwner).subscribe(
        //                 (ret: any) => {
        //                     if(ret && ret.ok) {
        //                         this.mainLayouts = ret._body;
        //                     }
        //                 }
        //             );

        //             this.productServ.getProductsOwnedBy(storeOwner, 100, 0).subscribe(
        //                 (ret: any) => {
        //                     this.latestProducts = ret;
        //                 }            
        //             );

        //             this.bannerServ.getMerchantBanners(storeOwner).subscribe(
        //                 (ret: any) => {
        //                     if(ret && ret.ok) {
        //                         this.banners = ret._body;
        //                     }
        //                 }
        //             );

        //             this.productServ.getMerchantHotCategories(storeOwner).subscribe(
        //                 (res: any) => {
        //                     if(res && res.ok) {
        //                         this.categories = res._body;
        //                     }
        //                 }
        //             );
        //         }

        //     }
        // );

    }
}
