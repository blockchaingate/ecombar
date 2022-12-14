import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { MainLayoutService } from 'src/app/modules/shared/services/mainlayout.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
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
    private dataServ: DataService,
    private route: ActivatedRoute,
    private mainLayoutServ: MainLayoutService,
    private bannerServ: TopCategoryBannerService,
    private productServ: ProductService) {

  }
  ngOnInit() {
    this.dataServ.currentStoreOwner.subscribe(
      (storeOwner: string) => {
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

  }
}