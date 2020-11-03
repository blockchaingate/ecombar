import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartStoreService } from '../../shared/services/cart.store.service';
import { CartItem } from '../../shared/models/cart-item';
import { Router } from '@angular/router';
import { TranslateService } from '../../shared/services/translate.service';
import { OrderService } from '../../shared/services/order.service';
import { AuthService } from '../../shared/services/auth.service';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss', '../../../../button.scss']
})
export class ProductComponent implements OnInit {
  product: any;
  id: string;
  quantity: string;
  selectedImage: string;
  constructor(
    private cartStoreServ: CartStoreService,
    private route: ActivatedRoute,
    private productServ: ProductService,
    private orderServ: OrderService,
    private router: Router,
    private storage: StorageService,
    private authServ: AuthService,
    private translateServ: TranslateService    
    ) {

  }
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.quantity = '1';
    this.productServ.getProduct(this.id).subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.product = res._body;
          console.log('this.product=', this.product);
          this.selectedImage = this.product.images[0];
        }
      }
    );
  }

  mouseEnter(image) {
      this.selectedImage = image;
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

  }
}
