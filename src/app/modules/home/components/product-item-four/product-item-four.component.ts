import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-product-item-four',
  templateUrl: './product-item-four.component.html',
  styleUrls: ['./product-item-four.component.scss']
})

export class ProductItemFourComponent implements OnInit {
  @Input() product: any;
    ngOnInit() {

    }
}
