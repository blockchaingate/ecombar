
import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { Router } from '@angular/router';
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { DataService } from 'src/app/modules/shared/services/data.service';


@Component({
    selector: 'app-admin-categories',
    providers: [CategoryService],
    templateUrl: './categories.component.html',
    styleUrls: [
        './categories.component.scss', 
        '../../../../../table.scss',
        '../../../../../page.scss'
    ]
})
export class CategoriesComponent implements OnInit {
    categories: any;
    wallet: any;
    modalRef: BsModalRef;
    storeId: string;
    store: any;

    constructor(
        private modalService: BsModalService,
        private router: Router,
        private dataServ: DataService,
        public kanbanServ: KanbanService,
        private categoryServ: CategoryService) {
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

        this.categories = [];
        // this.dataServ.currentWalletAddress.subscribe(
        //     (walletAddress: string) => {
        //         if(walletAddress) {
        //             this.getMerchantCategories(walletAddress);
        //         }
        //     }
        // );
        this.categoryServ.getCategoryList().subscribe(
            (res: any) => {
                if (res && res.status == 200 && res.data) {
                    console.log("categories=", res.data);
                    this.categories = res.data;
                }
            }
        );

    }

    // getMerchantCategories(walletAddress: string) {
    //     this.categoryServ.getMerchantCategories(walletAddress, 100, 0).subscribe(
    //         (res: any) => {
    //             if (res) {
    //                 this.categories = res;
    //             }
    //         }
    //     );
    // }

    editCategory(categoryId) {
        // this.router.navigate(['/merchant/category/' + category._id + '/edit']);
        this.router.navigate(['/merchant/category/' + categoryId + '/edit']);
    }

    deleteCategory(categoryId) {

        this.categoryServ.deleteCategory(categoryId).subscribe(
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

        // this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
        //     this.deleteCategoryDo(privateKey, category_id);
        // });
    }

    // deleteCategoryDo(privateKey: any, category_id: string) {
    //     const data = {
    //         id: category_id
    //     };
    //     const sig = this.kanbanServ.signJsonData(privateKey, data);
    //     data['sig'] = sig.signature;        
    //     this.categoryServ.deleteCategory(data).subscribe(
    //         (res: any) => {
    //             if (res && res.ok) {
    //                 this.categories = this.categories.filter((item) => item._id != category_id);
    //             }
    //         }
    //     );
    // }

}
