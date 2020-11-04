import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartStoreService } from '../../shared/services/cart.store.service';
import { CartItem } from '../../shared/models/cart-item';
import { Router } from '@angular/router';
import { TranslateService } from '../../shared/services/translate.service';
import { OrderService } from '../../shared/services/order.service';
import { CommentService } from '../../shared/services/comment.service';
import { FavoriteService } from '../../shared/services/favorite.service';
import { AuthService } from '../../shared/services/auth.service';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss', '../../../../button.scss']
})
export class ProductComponent implements OnInit {
  product: any;
  comments: any;
  id: string;
  rating: number;
  quantity: string;
  favorite: any;
  token: any;
  selectedImage: string;
  constructor(
    private cartStoreServ: CartStoreService,
    private route: ActivatedRoute,
    private productServ: ProductService,
    private favoriteServ: FavoriteService,
    private orderServ: OrderService,
    private commentServ: CommentService,
    private router: Router,
    private storage: StorageService,
    private authServ: AuthService,
    private translateServ: TranslateService    
    ) {

  }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');
    this.quantity = '1';

    this.commentServ.getComments(this.id).subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.comments = res._body;
          console.log('this.comments=', this.comments);
        }
      }
    );
    this.productServ.getProduct(this.id).subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.product = res._body;
          console.log('this.product=', this.product);
          this.selectedImage = this.product.images[0];
        }
      }
    );

    this.token = this.storage.token;
    if(this.token) {
      this.authServ.isAuthenticated(this.token).subscribe(
        (ret) => {
          if(!ret) {
            this.token = null;
          } else {
            this.initForUser();
          }
        }
      );
    } else {
      this.storage.get('_token').subscribe(
        (token: string) => {
          if(token) {
            this.authServ.isAuthenticated(token).subscribe(
              (ret) => {
                if(!ret) {
                  this.token = null;
                }  else {
                  this.token = token;
                  this.initForUser();
                }               
              }
            );
          }
        });      
    }  


  }

  initForUser() {
    console.log('initForUser start');
    this.favoriteServ.isMyFavorite(this.id).subscribe(
      (res: any) => {
        console.log('res==', res);
        if(res && res.ok) {
          const favorites = res._body;
          if(favorites && favorites.length) {
            this.favorite = favorites[0];
          }
        }
      }
    );
  }

  mouseEnter(image) {
      this.selectedImage = image;
  }

  addToFavorite() {
    const data = {
      parentId: this.id   
    };
    this.favoriteServ.create(data).subscribe(
      (res) => {
        if(res && res.ok) {
          console.log('addToFavorite successfully');
          this.favorite = res._body;
        }
      }
    );
  }

  removeFromFavorite() {
    if(!this.favorite) {
      return;
    }
    this.favoriteServ.deleteFavorite(this.favorite._id).subscribe(
      (res) => {
        if(res && res.ok) {
          console.log('removeFromFavorite successfully');
          this.favorite = null;
        }
      }      
    );
  }

  addToCart() {
    if(!Number(this.quantity)) {
        return;
    }
    const cartItem: CartItem = {
        productId: this.id,
        title: this.translateServ.transField(this.product.title),
        price: this.product.price,
        merchantId: this.product.merchantId,
        currency: this.product.currency,
        thumbnailUrl: this.product.images ? this.product.images[0] : null,
        quantity: Number(this.quantity)
      };
      this.cartStoreServ.addCartItem(cartItem);
  }

  buyDo() {
    const items: CartItem[] = [];

    const item = {
      productId: this.product._id,
      merchantId: this.product.merchantId,
      currency: this.product.currency,
      quantity: Number(this.quantity),
      price: this.product.price,
      thumbnailUrl: this.product.images ? this.product.images[0] : null,
      title: this.translateServ.transField(this.product.title)
    }

    items.push(item);

    const orderData = { 
      merchantId: this.product.merchantId, 
      items: items, 
      currency:this.product.currency, 
      transAmount: this.product.price * Number(this.quantity)
    };

    this.orderServ.create(orderData).subscribe(
      (res: any) => {
        console.log('ress from create order', res);
        if (res && res.ok) {
          const body = res._body;
          const orderID = body._id;
          this.cartStoreServ.empty();
          this.router.navigate(['/address/' + orderID]);
        }
      }
    );
  }

  buyNow() {
    if(this.token) {
      this.buyDo();
    } else {
      this.router.navigate(['auth/signin']);
    }
    /*
    const token = this.storage.token;
    if(token) {
      this.authServ.isAuthenticated(token).subscribe(
        (ret) => {
          if(ret) {
            this.buyDo();
          } else {
            this.router.navigate(['auth/signin']);
          }
        }
      );
    } else {
      this.storage.get('_token').subscribe(
        (token: string) => {
          if(token) {
            this.authServ.isAuthenticated(token).subscribe(
              (ret) => {
                if(ret) {
                  this.buyDo();
                } else {
                  this.router.navigate(['auth/signin']);
                }
              }
            ); 
          } else {
            this.router.navigate(['auth/signin']);
          }
         
        }
      );
    }
    */
  }
}
