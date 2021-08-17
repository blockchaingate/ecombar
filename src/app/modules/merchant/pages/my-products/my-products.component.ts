import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/modules/shared/services/order.service';

@Component({
  selector: 'app-admin-my-products',
  providers: [ProductService, UserService],
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {
  products: any;

  constructor(
    private userServ: UserService,
    private authServ: AuthService,
    private merchantServ: MerchantService,
    private router: Router,
    private orderServ: OrderService,
    private productServ: ProductService) {

  }

  ngOnInit() {

    this.getProducts();
  }
  getProducts() {
    this.orderServ.getMyProducts().subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.products = res._body;
        }
      }
    );
  }

  addComment(product) {

  }
  
}
