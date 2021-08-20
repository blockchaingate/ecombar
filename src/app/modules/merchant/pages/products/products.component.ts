import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
  selector: 'app-admin-products',
  providers: [ProductService, UserService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any;
  walletAddress: string;
  storeId: string;
  walletExgAddress: string;
  store: any;
  constructor(
    private router: Router,
    private dataServ: DataService,
    private utilServ: UtilService,
    private productServ: ProductService) {

  }

  ngOnInit() {
    this.dataServ.currentMyStore.subscribe(
      (store: any) => {
        if(store) {
          this.store = store;
          this.storeId = store._id;
        }

      }
    )
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
        console.log('walletAddress=', walletAddress);
        if(walletAddress) {
          this.productServ.getProductsOwnedBy(walletAddress).subscribe(
            (res: any) => {
              console.log('ressss=', res);
              if (res) {
                this.products = res;
              }
            }
          );  
        }
      
      }
    );      
    /*
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
    */
  }


  addNew() {
    /*
    if(!this.walletExgAddress) {
      this.toastr.info(
        this.translateServ.instant('Please set your wallet address in merchant information first'));
      return;
    }
    */
    this.router.navigate(['/merchant/product/add']);
  }

  editProduct(product) {
    /*
    if(!this.walletExgAddress) {
      this.toastr.info(
        this.translateServ.instant('Please set your wallet address in merchant information first'));
      return;
    } 
    */   
    this.router.navigate(['/merchant/product/' + product._id + '/edit']);
  }

  displayAddress(address: string) {
    return this.utilServ.displayAddress(address);
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
