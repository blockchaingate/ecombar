import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { StorageService } from '../../../shared/services/storage.service';
import { MerchantService } from '../../../shared/services/merchant.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin-category-add',
  providers: [CategoryService],
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class CategoryAddComponent implements OnInit {
  modalRef: BsModalRef;
  sequence: number;
  categories: any;
  selectedCategory: any;
  images: any;
  category: string;
  categoryChinese: string;
  currentTab: string;
  wallet: any;
  id: string;

  constructor(
    
    private merchantServ: MerchantService,
    private route: ActivatedRoute,
    private router: Router,
    public kanbanServ: KanbanService,
    private dataServ: DataService,
    private modalService: BsModalService,
    private storageServ: StorageService,
    private categoryServ: CategoryService) {
  }

  ngOnInit() {
    this.images = [];
    this.currentTab = 'default';

    this.dataServ.currentWallet.subscribe(
      (wallet: string) => {
        this.wallet = wallet;
      }
    ); 

    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.categoryServ.getMerchantCategories(walletAddress).subscribe(
            (res: any) => {
              if (res && res.ok) {
                this.categories = res._body;
              }
            }
          );
        }
      }
    );


    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.categoryServ.getCategory(this.id).subscribe(
        (res: any) => {
          if (res && res.ok) {
            const category = res._body;
            console.log('cateogryyy=', category);
            this.category = category.category.en;
            this.categoryChinese = category.category.sc;
            this.sequence = category.sequence;
            this.selectedCategory = category.parentId;
            //this.parentId = category.parentId;
            if(category.thumbnailUrl) {
              this.images.push(category.thumbnailUrl);
            }
          }

        }
      );
    }
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }


  changeSelectedCategory(cat: any) {
    this.selectedCategory = cat;
  }
  addCategory() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
      this.addCategoryDo(privateKey);
    });    
  }

  addCategoryDo(privateKey: any) {

    const data = {
      category: {
        en: this.category,
        sc: this.categoryChinese
      },
      sequence: this.sequence,
      thumbnailUrl: (this.images && (this.images.length > 0)) ? this.images[0] : null,
      parentId: this.selectedCategory ? this.selectedCategory._id : null
    };

    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    if (!this.id) {

      this.categoryServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/categories']);
          }
        }
      );
    } else {
      this.categoryServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/categories']);
          }
        }
      );
    }

  }
}
