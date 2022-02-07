import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { log } from 'console';

@Component({
  template:''
})
export class CartProductComponent implements OnInit {
  @Input() product: any;
  @Input() currency: string;
  @Output() productUpdated = new EventEmitter();
  ngOnInit() {
  }

  remove(): void {
    this.productUpdated.emit({ product: this.product, quantity: 0 });
  }

  modelChanged(event) {
    this.productUpdated.emit({ product: this.product, quantity: event });
  }

  quantityAdd(){
    this.productUpdated.emit({ product: this.product, quantity: this.product.quantity+1 });
  }

  quantityReduce(){
    if(this.product.quantity>1)
    this.productUpdated.emit({ product: this.product, quantity: this.product.quantity-1 });
  }
}
