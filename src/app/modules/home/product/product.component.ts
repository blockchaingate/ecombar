import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartStoreService } from '../../shared/services/cart.store.service';
import { CartItem } from '../../shared/models/cart-item';

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
    private productServ: ProductService) {

  }
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
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
      console.log('this.quantity==', this.quantity);
    if(!Number(this.quantity)) {
        return;
    }
    const cartItem: CartItem = {
        productId: this.id,
        title: this.product.title,
        price: this.product.price,
        merchantId: this.product.merchantId,
        currency: this.product.currency,
        thumbnailUrl: this.product.images ? this.product.images[0] : null,
        quantity: Number(this.quantity)
      };
      this.cartStoreServ.addCartItem(cartItem);
  }

  buyNow() {

  }
}
