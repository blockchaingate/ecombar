import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MerchantService } from '../../../shared/services/merchant.service';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';

@Component({
  selector: 'app-admin-my-products',
  providers: [ProductService, UserService],
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss', '../../../../../table.scss', '../../../../../button.scss']
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
