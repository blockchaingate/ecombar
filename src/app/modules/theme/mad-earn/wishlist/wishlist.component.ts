import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/modules/shared/models/cart-item';
import { FavoriteService } from 'src/app/modules/shared/services/favorite.service';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  favorites: any;
  constructor(private cartStoreServ: CartStoreService, private favoriteServ: FavoriteService) { }

  ngOnInit() {
    this.favoriteServ.getMine().subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.favorites = res._body;
          console.log('this.favorites==', this.favorites);
        }
      }
    );
  }

  addToCart(item) {
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

  unfavorite(id:string) {
    this.favoriteServ.deleteFavorite(id).subscribe(
      (res: any) => {
        if(res&&res.ok) {
          this.favorites = this.favorites.filter(item => item._id != id);
        }
      }
    );
  }
}
