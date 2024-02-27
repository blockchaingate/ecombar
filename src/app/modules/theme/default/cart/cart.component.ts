import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CartComponent as ParentCartComponent} from '../../../store/cart/cart.component'
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: [
    './cart.component.scss',
    '../../../../../page.scss'
  ]
})
export class CartComponent extends ParentCartComponent{}
