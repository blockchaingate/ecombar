import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-product-item-one',
  templateUrl: './product-item-one.component.html',
  styleUrls: ['./product-item-one.component.scss']
})

export class ProductItemOneComponent implements OnInit {
  @Input() product: any;
  @Input() storeId: string;
  @Input() currency: string;
  @Output() addToCartEvent = new EventEmitter<string>();
  ngOnInit() {

  }
  addToCart() {
    this.addToCartEvent.emit(this.product._id);
  }
}
