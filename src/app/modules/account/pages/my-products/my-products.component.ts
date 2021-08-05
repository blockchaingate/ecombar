import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MerchantService } from '../../../shared/services/merchant.service';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  selector: 'app-admin-my-products',
  providers: [],
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {
  products: any;

  constructor(
    private userServ: UserService,
    private authServ: AuthService,
    private dataServ: DataService,
    private merchantServ: MerchantService,
    private router: Router,
    private orderServ: OrderService,
    private productServ: ProductService) {

  }

  ngOnInit() {

    this.getProducts();
  }
  getProducts() {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.orderServ.getMyProducts(walletAddress).subscribe(
            (res: any) => {
              console.log('retdfff====', res);
              if(res && res.ok) {
                this.products = res._body;
              }
            }
          );
        }
      }
    );

  }

  addComment(product) {

  }
  
}
