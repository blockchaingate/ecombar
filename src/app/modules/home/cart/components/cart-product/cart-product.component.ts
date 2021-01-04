import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { log } from 'console';

@Component({
  selector: '[app-cart-product]',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss']
})
export class CartProductComponent implements OnInit {
  @Input() product: any;
  @Output() productUpdated = new EventEmitter();
  ngOnInit() {
    console.log('product=', this.product);
  }

  remove(): void {
    this.productUpdated.emit({ product: this.product, quantity: 0 });
  }

  modelChanged(event) {
    this.productUpdated.emit({ product: this.product, quantity: event });
  }

  quantityAdd(){
    console.log("Quantity add function!");
    this.productUpdated.emit({ product: this.product, quantity: this.product.quantity+1 });
  }

  quantityReduce(){
    console.log("Quantity reduce function!");
    if(this.product.quantity>1)
    this.productUpdated.emit({ product: this.product, quantity: this.product.quantity-1 });
  }
}
