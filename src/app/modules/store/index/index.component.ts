import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { MainLayoutService } from 'src/app/modules/shared/services/mainlayout.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { Product } from 'src/app/modules/shared/models/product';
import { TopCategoryBannerService } from 'src/app/modules/shared/services/top-category-banner.service';

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
    private productServ: ProductService) {

  }
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const storeId = params.get('storeId');
        console.log('storeId===', storeId);

        this.mainLayoutServ.getMerchantMainLayouts(storeId, 100, 0).subscribe(
          (ret: any) => {
            if(ret) {
              this.mainLayouts = ret;
            }
          }
        );

        this.productServ.getMerchantProducts(storeId, 100, 0).subscribe(
          (ret: any) => {
            this.latestProducts = ret;
          }            
        );

        this.bannerServ.getMerchantBanners(storeId, 100, 0).subscribe(
          (ret: any) => {
            if(ret) {
              this.banners = ret._body;
            }
          }
        );

        this.categoryServ.getMerchantHotCategories(storeId, 100, 0).subscribe(
          (res: any) => {
            if(res) {
              this.categories = res._body;
            }
          }
        );
      }
    );
    /*
    this.dataServ.currentStoreOwner.subscribe(
      (storeOwner: string) => {
        console.log('storeOwner======', storeOwner);
        if(storeOwner) {
          this.mainLayoutServ.getMerchantMainLayouts(storeOwner).subscribe(
            (ret: any) => {
              if(ret && ret.ok) {
                this.mainLayouts = ret._body;
              }
            }
          );

          this.productServ.getProductsOwnedBy(storeOwner, 100, 0).subscribe(
            (ret: any) => {
              this.latestProducts = ret;
            }            
          );

          this.bannerServ.getMerchantBanners(storeOwner).subscribe(
            (ret: any) => {
              if(ret && ret.ok) {
                this.banners = ret._body;
              }
            }
          );

          this.productServ.getMerchantHotCategories(storeOwner).subscribe(
            (res: any) => {
              if(res && res.ok) {
                this.categories = res._body;
              }
            }
          );
        }

      }
    );
    */
  }
}
