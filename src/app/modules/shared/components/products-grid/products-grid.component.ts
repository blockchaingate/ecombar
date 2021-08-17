import { Component, Input } from '@angular/core';
import { CartStoreService } from '../../services/cart.store.service';
import { FavoriteService } from 'src/app/modules/shared/services/favorite.service';
import { CartItem } from '../../models/cart-item';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss']
})
export class ProductsGridComponent {
  iddockRoot: string;
  @Input() products: any;

  constructor(
    private favoriteServ: FavoriteService,
    private cartStoreServ: CartStoreService) {
    this.iddockRoot = environment.IDDOCK;
  }

  addToCart(item: any) {
    console.log('item to be added=', item);
    const cartItem: CartItem = {
      productId: item._id,
      title: item.title,
      price: item.price,
      merchantId: item.merchantId,
      currency: item.currency,
      thumbnailUrl: item.images ? item.images[0] : null,
      quantity: 1
    };
    this.cartStoreServ.addCartItem(cartItem);
  }

  addFavorite(item: any) {
    const data = {
      parentId: item._id
    };
    this.favoriteServ.create(data).subscribe(
      (res: any) => {
        if(res && res.ok) {
          console.log('gogogo');
        }
      }
    );
  }
}


