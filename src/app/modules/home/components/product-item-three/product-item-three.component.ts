import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-product-item-three',
  templateUrl: './product-item-three.component.html',
  styleUrls: ['./product-item-three.component.scss']
})

export class ProductItemThreeComponent implements OnInit {
  @Input() product: any;
    ngOnInit() {

    }
}
