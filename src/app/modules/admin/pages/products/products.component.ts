import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import {TranslateService} from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserState } from 'src/app/store/states/user.state';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-products',
  providers: [ProductService, UserService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any;

  walletExgAddress: string;
  constructor(
    private store: Store<{ user: UserState }>,
    private toastr: ToastrService,
    private router: Router,
    private translateServ: TranslateService,
    private productServ: ProductService) {

  }

  ngOnInit() {
    this.store.select('user').subscribe(
      (userState: UserState) => {
        const role = userState.role;
        const merchantId = userState.merchantId;
        this.walletExgAddress = userState.walletExgAddress;
        if(role == 'Admin') {
          this.productServ.getProducts().subscribe(
            (res: any) => {
              if (res && res.ok) {
                this.products = res._body;
              }
            }
          );
        } else
        if((role == 'Seller') && merchantId) {
          this.productServ.getMerchantProducts(merchantId).subscribe(
            (res: any) => {
              if (res && res.ok) {
                this.products = res._body;
              }
            }
          );
        }
      }
    );
  }


  addNew() {
    /*
    if(!this.walletExgAddress) {
      this.toastr.info(
        this.translateServ.instant('Please set your wallet address in merchant information first'));
      return;
    }
    */
    this.router.navigate(['/admin/product/add']);
  }

  editProduct(product) {
    /*
    if(!this.walletExgAddress) {
      this.toastr.info(
        this.translateServ.instant('Please set your wallet address in merchant information first'));
      return;
    } 
    */   
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
