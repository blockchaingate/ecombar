import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-product-list-whole',
  templateUrl: './product-list-whole.component.html',
  styleUrls: ['./product-list-whole.component.scss']
})

export class ProductListWholeComponent implements OnInit {
    @Input() products: any;
    
    ngOnInit() {

    }
}
