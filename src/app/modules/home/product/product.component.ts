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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss', '../../../../button.scss']
})
export class ProductComponent implements OnInit {
  product: any;
  comments: any;
  id: string;
  quantity: number;
  colors: any;
  relatedProducts: any;
  favorite: any;
  token: any;
  overall: number;
  rating5: number;
  rating4: number;
  rating3: number;
  rating2: number;
  rating1: number;

  selectedImage: string;
  constructor(
    private cartStoreServ: CartStoreService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
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


    this.overall = 0;
    this.rating1 = 0;
    this.rating2 = 0;
    this.rating3 = 0;
    this.rating4 = 0;
    this.rating5 = 0;

    this.productServ.getRelatedProducts(this.id).subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.relatedProducts = res._body;
          console.log('this.relatedProducts=', this.relatedProducts);
        }
      }
    );

    this.commentServ.getComments(this.id).subscribe(
        (res: any) => {
            if(res && res.ok) {
                this.comments = res._body;
                console.log('this.comments=', this.comments);
                for(let i=0;i<this.comments.length;i++) {
                    const comment = this.comments[i];
                    const rating = comment.rating;
                    this.overall += rating;
                    if(rating == 1) {
                        this.rating1 += 1;
                    } else
                    if(rating == 2) {
                        this.rating2 += 1;
                    } else
                    if(rating == 3) {
                        this.rating3 += 1;
                    } else
                    if(rating == 4) {
                        this.rating4 += 1;
                    } else
                    if(rating == 5) {
                        this.rating5 += 1;
                    }                                   
                }
                if(this.comments.length > 0) {
                    this.overall /= this.comments.length;
                }
            }
        }
    );



    this.quantity = 1;

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
          this.colors = this.product.colors;

          console.log('this.product=', this.product);
          console.log('this.colors=', this.colors);
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


  getProductQuantity() {
    let quantity = 0;
    const contents = this.product.contents;
    for(let i=0;i<contents.length;i++) {
      quantity += contents[i].quantity;
    }
    return quantity;
  }
  
  decQuantity() {
    if(this.quantity > 1) {
      this.quantity --;
    }
    
  }

  incQuantity() {
    this.quantity ++;
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

  addToFavorite(id) {
    
    const data = {
      parentId: id   
    };
    this.favoriteServ.create(data).subscribe(
      (res) => {
        if(res && res.ok) {
          this.toastr.success('add to favorite successfully', '');
          this.favorite = res._body;
        }
      }
    );
  }

  onAddToFavorite(event) {
    this.addToFavorite(event);
  }

  onAddToCart(event) {
    console.log('event in onAddToCart=', event);
    this.addToCart(event.product, event.quantity);
  }

  removeFromFavorite() {
    if(!this.favorite) {
      return;
    }
    this.favoriteServ.deleteFavorite(this.favorite._id).subscribe(
      (res) => {
        if(res && res.ok) {
          this.toastr.success('remove from favorite successfully', '');
          this.favorite = null;
        }
      }      
    );
  }

  addToCart(product: any, quantity: number) {
    if(!Number(quantity)) {
        return;
    }
    const cartItem: CartItem = {
        productId: product._id,
        objectId: product.objectId,
        title: this.translateServ.transField(product.title),
        price: product.price,
        merchantId: product.merchantId,
        currency: product.currency,
        thumbnailUrl: product.images ? product.images[0] : null,
        quantity: Number(quantity)
      };
      this.cartStoreServ.addCartItem(cartItem);
  }

  buyDo() {
    const items: CartItem[] = [];

    const item = {
      productId: this.product._id,
      objectId: this.product.objectId,
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
