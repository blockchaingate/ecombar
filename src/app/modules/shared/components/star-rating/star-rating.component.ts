import { Component, Input } from '@angular/core';
import { CartStoreService } from '../../services/cart.store.service';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss', '../../../../../button.scss']
})
export class StarRatingComponent {
  constructor() {
  }

}
