import { Component } from '@angular/core';
import { CartStoreService } from '../../../../shared/services/cart.store.service';
import { CartItem } from '../../../../shared/models/cart-item';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent {

  collections = [
    {
      name: 'Hot sales',
      items: [
        {
          _id: '1',
          medias: [
            '/assets/images/test/91215_lhpvt_a91.jpeg',
            '/assets/images/test/76105_b4quj_a91.jpeg',
            '/assets/images/test/627_b4r7b_a91.jpeg'
          ],
          name: 'product 1',
          price: 22,
          currency: 'USDT',
          sell_qty: 1
        },
        {
          _id: '2',
          medias: [
            '/assets/images/test/91215_lhpvt_a91.jpeg',
            '/assets/images/test/76105_b4quj_a91.jpeg',
            '/assets/images/test/627_b4r7b_a91.jpeg'
          ],
          name: 'product 2',
          price: 210,
          currency: 'EXG',
          sell_qty: 1
        },
        {
          _id: '3',
          medias: [
            '/assets/images/test/91215_lhpvt_a91.jpeg',
            '/assets/images/test/76105_b4quj_a91.jpeg',
            '/assets/images/test/627_b4r7b_a91.jpeg'
          ],
          name: 'product 3',
          price: 24,
          currency: 'ETH',
          sell_qty: 1
        },
        {
          _id: '4',
          medias: [
            '/assets/images/test/91215_lhpvt_a91.jpeg',
            '/assets/images/test/76105_b4quj_a91.jpeg',
            '/assets/images/test/627_b4r7b_a91.jpeg'
          ],
          name: 'product 4',
          price: 2700,
          currency: 'FAB',
          sell_qty: 1
        }                        
      ]
    }
  ];


  constructor(private cartStoreServ:CartStoreService) {

  }

  addToCart(item) {
    const cartItem: CartItem = {
      _id: item._id,
      name: item.name,
      price: item.price,
      currency: item.currency,
      quantity: 1
    };
    this.cartStoreServ.addCartItem(cartItem);
  }
}
