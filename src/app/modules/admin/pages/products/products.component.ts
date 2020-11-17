import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MerchantService } from '../../../shared/services/merchant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  providers: [ProductService, UserService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any;

  constructor(
    private userServ: UserService,
    private authServ: AuthService,
    private merchantServ: MerchantService,
    private router: Router,
    private productServ: ProductService) {

  }

  ngOnInit() {

    this.getProducts();
  }
  getProducts() {
    const merchantId = this.merchantServ.id;

    if (this.userServ.isSystemAdmin) {
      this.productServ.getProducts().subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.products = res._body;
          }
        }
      );
    } else
      if (merchantId) {
        this.productServ.getMerchantProducts(merchantId).subscribe(
          (res: any) => {
            if (res && res.ok) {
              this.products = res._body;
            }
          }
        );
      }
  }

  editProduct(product) {
    this.router.navigate(['/admin/product/' + product._id + '/edit']);
  }

  deleteProduct(product) {
    this.productServ.deleteProduct(product._id).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.products = this.products.filter((item) => item._id != product._id);
        }
      }
    );
  }
}
