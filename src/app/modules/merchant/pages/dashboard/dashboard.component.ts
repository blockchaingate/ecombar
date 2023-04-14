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
import { DataService } from 'src/app/modules/shared/services/data.service';
import { OrdersComponent } from '../orders/orders.component';

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
    private collectionServ: CollectionService,
    private productServ: ProductService,
    private categoryServ: CategoryService,
    private dataServ: DataService) {
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

    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.getMerchantSummaries(walletAddress);
        }
      }
    );
    


  }



  getMerchantSummaries(walletAddress: string) {

    this.brandServ.getMerchantBrands(walletAddress, 100, 0).subscribe(
      (res: any) => {
        if (res) {
          this.brands_count = res.length;
        }
      }
    );

    this.categoryServ.getMerchantCategories(walletAddress, 100, 0).subscribe(
      (res: any) => {
        if (res) {
          this.categories_count = res.length;
        }
      }
    );   
    
    this.productServ.getProductsOwnedBy(walletAddress, 100, 0).subscribe(
      (res: any) => {
        if (res) {
          this.products_count = res.length;
        }
      }
    );  
    
    this.collectionServ.getMerchantCollections(walletAddress, 100, 0).subscribe(
      (res: any) => {
        if (res) {
          this.collections_count = res.length;
        }
      }
    );    
  }

}


