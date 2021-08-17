import { Component, Input, OnInit } from '@angular/core';
import { CartStoreService } from '../../services/cart.store.service';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { CartItem } from '../../models/cart-item';
import { environment } from '../../../../../environments/environment';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss', '../../../../../button.scss']
})
export class ProductsGridComponent implements OnInit{
  iddockRoot: string;
  storeId: string;
  currency: string;
  @Input() products: any;

  constructor(
    private dataServ: DataService,
    private favoriteServ: FavoriteService,
    private cartStoreServ: CartStoreService) {
    this.iddockRoot = environment.IDDOCK;
  }

  ngOnInit() {
    this.dataServ.currentStore.subscribe(
      (store: any) => {
        console.log('store=', store);
        this.storeId = store._id;
        this.currency = store.coin;
      }
    );
  }

  addToCart(item: any) {
    const cartItem: CartItem = {
      productId: item._id,
      objectId: item.objectId,
      title: item.title,
      price: item.price,
      storeId: this.storeId,
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


