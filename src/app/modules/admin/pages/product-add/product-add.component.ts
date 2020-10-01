import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { currencies } from '../../../../../environments/currencies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-product-add',
  providers: [ProductService, CategoryService],
  templateUrl: './product-add.component.html',
  styleUrls: [
    './product-add.component.scss', 
    '../../../../../select.scss', 
    '../../../../../card.scss', 
    '../../../../../button.scss'
  ]
})
export class ProductAddComponent implements OnInit{
    title: string;
    price: string;
    category: string;
    categories: any;
    currencies: any;
    currency: string;
    description: string;

    constructor(
      private router: Router, 
      private categoryServ: CategoryService,
      private productServ: ProductService) {

    }

    ngOnInit() {
      this.currencies = currencies;
      this.categoryServ.getCategories().subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.categories = res._body;
          }
        }
      );
    }
    addProduct() {
        const data = {
          title: this.title,
          price: this.price,
          currency: this.currency,
          primaryCategoryId: this.category
        };
        this.productServ.create(data).subscribe(
          (res: any) => {
            console.log('res=', res);
          }
        );
    }
}
