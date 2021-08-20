import { Component, Input, OnInit } from '@angular/core';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';
import { FavoriteService } from 'src/app/modules/shared/services/favorite.service';
import { CartItem } from 'src/app/modules/shared/models/cart-item';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  selector: 'app-ProductRow',
  templateUrl: './ProductRow.component.html',
  styleUrls: ['./ProductRow.component.scss']
})
export class ProductRowComponent implements OnInit {
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
    console.log("ProductRowComponent");
    
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


