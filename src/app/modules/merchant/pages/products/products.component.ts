
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
    styleUrls: [
        './products.component.scss',
        '../../../../../page.scss'
    ]
})
export class ProductsComponent implements OnInit {
    modalRef: BsModalRef;
    products: any;
    wallet: any;
    walletAddress: string;
    walletExgAddress: string;
    storeId: string;
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

        this.updateData();  // 更新数据（即时刷新）

        this.dataServ.currentMyStore.subscribe(
            (store: any) => {
                if(store) {
                    this.store = store;
                    this.storeId = store._id;
                }
            }
        )
    }

    // 更新数据（即时刷新）
    updateData() {

        this.products = [];
        // this.dataServ.currentWalletAddress.subscribe(
        //     (walletAddress: string) => {
        //         this.walletAddress = walletAddress;
        //         if(walletAddress) {
        //             this.productServ.getProductsOwnedBy(walletAddress, 100, 0).subscribe(
        //                 (res: any) => {
        //                     if (res) {
        //                         this.products = res;
        //                         console.log('this.products===', this.products);
        //                     }
        //                 }
        //             );  
        //         }
            
        //     }
        // );      
        this.productServ.getProductList().subscribe(
            (res: any) => {
                if (res && res.status == 200 && res.data) {
                    console.log("products=", res.data);
                    this.products = res.data;
                }
            }
        );

    }

    addNew() {

        this.router.navigate(['/merchant/product/add']);
    }

    editProduct(productId) {

        this.router.navigate(['/merchant/product/' + productId + '/edit']);
    }

    displayAddress(address: string) {
        return this.utilServ.displayAddress(address);
    }
    
    deleteProduct(productId) {

        this.productServ.removeProduct(productId).subscribe(  // deleteProduct 重复
            (res: any) => {
                if (res && res.status == 200 && res.data) {
                    // location.reload();
                    this.updateData();  // 更新数据（即时刷新）
                }
            }
        );
        
        // const initialState = {
        //     pwdHash: this.wallet.pwdHash,
        //     encryptedSeed: this.wallet.encryptedSeed
        // };        

        // if(!this.wallet || !this.wallet.pwdHash) {
        //     this.router.navigate(['/wallet']);
        //     return;
        // }

        // this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

        // this.modalRef.content.onCloseFabPrivateKey.subscribe( (privateKey: any) => {
        //     this.deleteProductDo(privateKey, product);
        // });
    }

    // deleteProductDo( privateKey, product ) {
    //     const body = {
    //         id: product._id
    //     };
    //     const sig = this.kanbanServ.signJsonData(privateKey, body);
    //     body['sig'] = sig.signature;  
    //     this.productServ.deleteProduct2(body).subscribe(
    //         (res: any) => {
    //             if (res && res.ok) {
    //                 this.products = this.products.filter((item) => item._id != product._id);
    //             }
    //         }
    //     );
    // }
}
