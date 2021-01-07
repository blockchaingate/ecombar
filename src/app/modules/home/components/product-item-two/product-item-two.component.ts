import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-product-item-two',
  templateUrl: './product-item-two.component.html',
  styleUrls: ['./product-item-two.component.scss']
})

export class ProductItemTwoComponent implements OnInit {
  @Input() product: any;
    ngOnInit() {

    }
}
