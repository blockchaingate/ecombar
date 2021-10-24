import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartProductComponent as ParentCartProductComponent} from 'src/app/modules/store/cart/components/cart-product/cart-product.component'


@Component({
  selector: '[app-cart-product]',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss']
})
export class CartProductComponent extends ParentCartProductComponent{}