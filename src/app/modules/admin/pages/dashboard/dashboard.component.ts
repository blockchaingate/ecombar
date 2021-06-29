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

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
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
    private userServ: UserService,
    private merchantServ: MerchantService,
    private storageServ: StorageService,
    private brandServ: BrandService,
    private orderServ: OrderService,
    private favoriteServ: FavoriteService,
    private cartStoreServ: CartStoreService,
    private collectionServ: CollectionService,
    private productServ: ProductService,
    private categoryServ: CategoryService,
    private commentServ: CommentService,
    private router: Router) {
  }

  getSummaries(merchantId : string) {
    if (this.userServ.isSystemAdmin) {
      this.getAdminSummaries();
    } else {
      this.storageServ.get('_isSystemAdmin').subscribe(
        (ret:boolean) => {
          if(ret) {
            this.getAdminSummaries();
          } else {
            this.getMerchantSummaries(merchantId);
          }
        }
      );
      
    } 
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

    const merchantId = this.merchantServ.id;
    if(merchantId) {
      this.getSummaries(merchantId);
    } else {
      this.storageServ.get('_merchantId').subscribe(
        (ret: any) => {
          this.getSummaries(ret);
        }
      );      
    }

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

  getUserSummaries() {
    this.isUserSummary = true;
    const cartItems = this.cartStoreServ.items;
    console.log('cartItems==', cartItems);
    if(cartItems && (cartItems.length > 0)) {
      for(let i=0;i < cartItems.length; i++) {
        const cartItem = cartItems[i];
        this.my_cart_count += cartItem.quantity;
      }
    }

    this.favoriteServ.getMine().subscribe(
      (res: any) => {
        if(res && res.ok) {
          const favorites = res._body;
          if(favorites) {
            this.my_favorite_count = favorites.length;
          }
        }
      }
    );   
    
    this.orderServ.getMyProducts().subscribe(
      (res: any) => {
        if(res && res.ok) {
          const products = res._body;
          if(products) {
            this.my_products_count = products.length;
          }
        }
      }
    );    

    this.commentServ.getMyComments().subscribe(
      (res: any) => {
        console.log('resssss=', res);
        if(res && res.ok) {
           const comments = res._body; 
           if(comments) {
             this.my_comments_count = comments.length;
           }
        }
      }
    );    
  }

  getMerchantSummaries(merchantId: string) {
    if(!merchantId) {
      this.getUserSummaries();
      return;
    }
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
