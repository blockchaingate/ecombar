import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';

@Component({
  selector: 'app-admin-products',
  providers: [ProductService, UserService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  modalRef: BsModalRef;
  products: any;
  wallet: any;
  walletAddress: string;
  storeId: string;
  walletExgAddress: string;
  store: any;
  constructor(
    private router: Router,
    private modalService: BsModalService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private kanbanServ: KanbanService,
    private productServ: ProductService) {

  }

  ngOnInit() {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );

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
        if(walletAddress) {
          this.productServ.getProductsOwnedBy(walletAddress, 100, 0).subscribe(
            (res: any) => {
              if (res) {
                this.products = res;
              }
            }
          );  
        }
      
      }
    );      
  }


  addNew() {

    this.router.navigate(['/merchant/product/add']);
  }

  editProduct(product) {

    this.router.navigate(['/merchant/product/' + product._id + '/edit']);
  }

  displayAddress(address: string) {
    return this.utilServ.displayAddress(address);
  }
  
  deleteProduct(product) {

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };        
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onCloseFabPrivateKey.subscribe( (privateKey: any) => {
      this.deleteProductDo(privateKey, product);
    });


  }

  deleteProductDo(privateKey, product) {
    const body = {
      id: product._id
    };
    const sig = this.kanbanServ.signJsonData(privateKey, body);
    body['sig'] = sig.signature;  
    this.productServ.deleteProduct2(body).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.products = this.products.filter((item) => item._id != product._id);
        }
      }
    );
  }
}
