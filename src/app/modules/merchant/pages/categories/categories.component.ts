import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { Router } from '@angular/router';
import { MerchantService } from '../../../shared/services/merchant.service';
import { StorageService } from '../../../shared/services/storage.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { DataService } from 'src/app/modules/shared/services/data.service';


@Component({
  selector: 'app-admin-categories',
  providers: [CategoryService],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss', '../../../../../table.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any;
  wallet: any;
  modalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private dataServ: DataService,
    public kanbanServ: KanbanService,
    private categoryServ: CategoryService) {
  }

  ngOnInit() {


    this.categories = [];
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.getMerchantCategories(walletAddress);
        }
      }
    );
    this.dataServ.currentWallet.subscribe(
      (wallet: string) => {
        this.wallet = wallet;
      }
    );      
  }

  getMerchantCategories(walletAddress: string) {
    this.categoryServ.getMerchantCategories(walletAddress).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.categories = this.categories.concat(res._body);
        }
      }
    );
  }

  editCategory(category) {
    this.router.navigate(['/merchant/category/' + category._id + '/edit']);
  }

  deleteCategory(category_id) {

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
      this.deleteCategoryDo(privateKey, category_id);
    });
  }

  deleteCategoryDo(privateKey: any, category_id: string) {
    const data = {
      id: category_id
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;        
    this.categoryServ.deleteCategory(data).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.categories = this.categories.filter((item) => item._id != category_id);
        }
      }
    );
  }
}
