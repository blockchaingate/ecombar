import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart-product',
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
}
