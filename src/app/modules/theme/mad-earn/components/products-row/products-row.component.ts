import { Component, Input, OnInit } from '@angular/core';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';
import { FavoriteService } from 'src/app/modules/shared/services/favorite.service';
import { CartItem } from 'src/app/modules/shared/models/cart-item';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/modules/shared/services/data.service';
@Component({
  selector: 'app-products-row',
  templateUrl: './products-row.component.html',
  styleUrls: ['./products-row.component.scss']
})
export class ProductsRowComponent implements OnInit{
  iddockRoot: string;
  storeId: string;
  store: any;
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
        this.store = store;
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
      rebateRate: item.rebateRate ? item.rebateRate : this.store.rebateRate,
      taxRate: item.taxRate ? item.taxRate : this.store.taxRate,
      lockedDays: item.lockedDays ? item.lockedDays : this.store.lockedDays,
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


