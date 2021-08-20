import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { BrandService } from 'src/app/modules/shared/services/brand.service';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { CollectionService } from 'src/app/modules/shared/services/collection.service';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';
import { FavoriteService } from 'src/app/modules/shared/services/favorite.service';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { CommentService } from 'src/app/modules/shared/services/comment.service';
import { Store } from '@ngrx/store';
import { UserState } from '../../../../store/states/user.state';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  merchantStatus: string;
  summary: any;
  isUserSummary: boolean;
  brands_count: number;
  categories_count: number;
  products_count: number;
  collections_count: number;

  my_cart_count: number;
  my_favorite_count: number;
  my_products_count: number;
  my_comments_count: number;

  constructor(
    private brandServ: BrandService,
    private orderServ: OrderService,
    private favoriteServ: FavoriteService,
    private cartStoreServ: CartStoreService,
    private collectionServ: CollectionService,
    private productServ: ProductService,
    private categoryServ: CategoryService,
    private commentServ: CommentService,
    private store: Store<{ user: UserState }>) {
  }

  ngOnInit() {
    this.isUserSummary = false;
    this.brands_count = 0;
    this.categories_count = 0;
    this.products_count = 0;
    this.collections_count = 0;    

    this.my_cart_count = 0;
    this.my_favorite_count = 0;
    this.my_products_count = 0;
    this.my_comments_count = 0;


    this.getMerchantSummaries('');


  }



  getMerchantSummaries(merchantId: string) {

    this.brandServ.getMerchantBrands(merchantId).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.brands_count = res._body.length;
        }
      }
    );

    this.categoryServ.getMerchantCategories(merchantId).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.categories_count = res._body.length;
        }
      }
    );   
    
    this.productServ.getMerchantProducts(merchantId).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.products_count = res._body.length;
        }
      }
    );  
    
    this.collectionServ.getMerchantCollections(merchantId).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.collections_count = res._body.length;
        }
      }
    );    
  }

}


