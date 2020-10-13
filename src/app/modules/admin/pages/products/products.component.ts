import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  providers: [ProductService, UserService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss', '../../../../../table.scss',  '../../../../../button.scss']
})
export class ProductsComponent implements OnInit{
  products: any;
  
  constructor(
    private userServ: UserService,
    private authServ: AuthService,
    private router: Router,
    private productServ: ProductService) {

  }

  ngOnInit() {
    
    this.getProducts();
  }
  getProducts() {

    this.userServ.getToken().subscribe(
      (token: any) => {
        const decoded = this.authServ.decodeToken(token);
        const aud = decoded.aud;
        const merchantId = decoded.merchantId;

        console.log('aud===', aud);
        console.log('merchantId==', merchantId);
        if (aud == 'isSystemAdmin') {
          this.productServ.getProducts().subscribe(
            (res: any) => {
              if(res && res.ok) {
                this.products = res._body;
              }
            }
          );
        }  else 
        if (merchantId) {
          this.productServ.getMerchantProducts(merchantId).subscribe(
            (res: any) => {
              if(res && res.ok) {
                this.products = res._body;
              }
            }
          );
        }
      } 
    );


  }

  editProduct(product) {
    this.router.navigate(['/admin/product/' + product._id + '/edit']);
  }

  deleteProduct(product) {
    this.productServ.deleteProduct(product._id).subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.products = this.products.filter((item) => item._id != product._id);
        }
      }
    );
  }
}
