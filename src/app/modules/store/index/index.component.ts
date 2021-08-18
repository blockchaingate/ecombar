import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { MainLayoutService } from '../../shared/services/mainlayout.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { Product } from '../../shared/models/product';
import { TopCategoryBannerService } from '../../shared/services/top-category-banner.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
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
              console.log('ret444445555=', ret);
              if(ret && ret.ok) {
                this.mainLayouts = ret._body;
              }
            }
          );

          this.productServ.getProductsOwnedBy(storeOwner).subscribe(
            (ret: any) => {
              console.log('ret for latestProduct=', ret);
              this.latestProducts = ret;
            }            
          );

          this.bannerServ.getMerchantBanners(storeOwner).subscribe(
            (ret: any) => {
              if(ret && ret.ok) {
                this.banners = ret._body;
                console.log('this.banners=', this.banners);
              }
            }
          );
        }

      }
    );

    /*
    this.productServ.getAdminHotCategories().subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.categories = res._body;
        }
      }
    );

    this.mainLayoutServ.getAdminMainLayouts().subscribe(
      (res:any) => {
        console.log('resss=', res);
        if(res.ok) {
          this.mainLayouts = res._body;
          console.log('this.mainLayouts=', this.mainLayouts);
          
        }
      }
    );  
    */  
  }
}
