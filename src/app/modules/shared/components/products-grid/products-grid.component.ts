import { Component,Input } from '@angular/core';
import { CartStoreService } from '../../services/cart.store.service';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss', '../../../../../button.scss']
})
export class ProductsGridComponent {
  @Input() products: any;

  constructor(
    private cartStoreServ:CartStoreService    
  ) {

  }
  addToCart(item) {
    console.log('item to be added=', item);
    const cartItem: CartItem = {
      product_id: item._id,
      title: item.title,
      price: item.price,
      merchantId: item.merchantId,
      currency: item.currency,
      image: item.images ? item.images[0] : null,
      quantity: 1
    };
    this.cartStoreServ.addCartItem(cartItem);
  }  
}
