import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-product-item-one',
  templateUrl: './product-item-one.component.html',
  styleUrls: ['./product-item-one.component.scss']
})

export class ProductItemOneComponent implements OnInit {
  @Input() product: any;
  @Input() storeId: string;
    ngOnInit() {

    }
}
