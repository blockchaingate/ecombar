import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { CartItem } from 'src/app/modules/shared/models/cart-item';
import { TranslateService } from 'src/app/modules/shared/services/translate.service';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {
    @Input() mode: string;
    @Input() products: any;
    @Input() currency: string;
    storeId: string;
    
    constructor(
      private cartStoreServ: CartStoreService,
      private translateServ: TranslateService,   
      private dataServ: DataService) {}
    ngOnInit() {
      this.dataServ.currentStoreId.subscribe(
        (storeId: string) => {
          this.storeId = storeId;
        }
      );
    }

    onAddToCartEvent(product_id: String) {
      const product = this.products.filter(item => item._id == product_id)[0];
      const cartItem: CartItem = {
        productId: product._id,
        objectId: product.objectId,
        title: this.translateServ.transField(product.title),
        price: product.price,
        storeId: this.storeId,
        currency: product.currency,
        thumbnailUrl: product.images ? product.images[0] : null,
        quantity: 1
      };
      this.cartStoreServ.addCartItem(cartItem);
    }
}
