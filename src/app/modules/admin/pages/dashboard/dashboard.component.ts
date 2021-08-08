import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { MerchantService } from '../../../shared/services/merchant.service';
import { StorageService } from '../../../shared/services/storage.service';
import { BrandService } from '../../../shared/services/brand.service';
import { CategoryService } from '../../../shared/services/category.service';
import { ProductService } from '../../../shared/services/product.service';
import { CollectionService } from '../../../shared/services/collection.service';
import { CartStoreService } from '../../../shared/services/cart.store.service';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { OrderService } from '../../../shared/services/order.service';
import { CommentService } from '../../../shared/services/comment.service';
import { Store } from '@ngrx/store';
import { UserState } from '../../../../store/states/user.state';
import { DataService } from 'src/app/modules/shared/services/data.service';

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
    private dataServ: DataService,
    private categoryServ: CategoryService,
    private commentServ: CommentService,
    private store: Store<{ user: UserState }>) {
  }

  ngOnInit() {

    this.dataServ.currentWalletAddress.subscribe(
      (address: string) => {
        console.log('address11qqaa=', address);
      }
    );
    this.isUserSummary = false;
    this.brands_count = 0;
    this.categories_count = 0;
    this.products_count = 0;
    this.collections_count = 0;    

    this.my_cart_count = 0;
    this.my_favorite_count = 0;
    this.my_products_count = 0;
    this.my_comments_count = 0;


    this.getAdminSummaries();


  }

  getAdminSummaries() {
    this.brandServ.getBrands().subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.brands_count = res._body.length;
        }
      }
    );

    this.categoryServ.getAdminCategories().subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.categories_count = res._body.length;
        }
      }
    );   
    
    this.productServ.getProducts().subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.products_count = res._body.length;
        }
      }
    ); 

    this.collectionServ.getAdminCollections().subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.collections_count = res._body.length;
        }
      }
    );    
  }

}


