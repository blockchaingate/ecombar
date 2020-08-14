import { Component } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-product-add',
  providers: [ProductService, UserService],
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent {
    title: string;
    price: string;
    currency: string;

    constructor(
      private router: Router, 
      private userServ: UserService,
      private productServ: ProductService) {

    }
    addProduct() {
        const data = {
          title: this.title,
          price: this.price,
          currency: this.currency,
          token: this.userServ.getToken()
        };
        this.productServ.create(data).subscribe(
          (res: any) => {
            console.log('res=', res);
          }
        );
    }
}
