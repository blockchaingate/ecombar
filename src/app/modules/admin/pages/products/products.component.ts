import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-admin-products',
  providers: [ProductService, UserService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit{
  products: any;
  constructor(
    private userServ: UserService,
    private productServ: ProductService) {
  }

  ngOnInit() {
    this.getProducts();
  }
  getProducts() {
    this.productServ.getMerchantProducts(this.userServ.getToken()).subscribe(
      (res: any) => {
        console.log('res=', res);
        if(res && res.ok) {
          this.products = res._body;
        }
      }
    );
  }
}
