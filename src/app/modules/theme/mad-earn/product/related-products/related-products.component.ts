import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.scss']
})
export class RelatedProductsComponent implements OnInit {
   @Input() products: any;
   @Input() storeId: string;
   @Output() onAddToFavorite= new EventEmitter<string>();
   @Output() onAddToCart= new EventEmitter<any>();

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

  }

  addToWishList(id: string) {
    this.onAddToFavorite.emit(id);
  }

  addToCart(product: any, quantity: number) {
    const event = {
      product, quantity
    }
    this.onAddToCart.emit(event);
  }  
}
