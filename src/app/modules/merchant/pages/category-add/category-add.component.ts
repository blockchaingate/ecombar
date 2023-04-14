
import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin-category-add',
  providers: [CategoryService],
  templateUrl: './category-add.component.html',
  styleUrls: [
    './category-add.component.scss',
    '../../../../../page.scss'
  ]
})
export class CategoryAddComponent implements OnInit {
  modalRef: BsModalRef;
  sequence: number;
  categories: any;
  selectedCategory: any;
  images: any;
  name: string;
  nameChinese: string;
  nameTradition: string;
  NavTab: string;    // 导航 Tab
  currentTab: string;    // 语言 Tab
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
    this.NavTab = 'General';    // 缺省页面
    this.currentTab = 'default English';    // 缺省页面

    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 

    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.categoryServ.getMerchantCategories(walletAddress, 100, 0).subscribe(
            (res: any) => {
              if (res) {
                this.categories = res;
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
          if (res) {
            const category = res;
            console.log('cateogryyy=', category);
            this.name = category.name.en;
            this.nameChinese = category.name.sc;
            this.nameTradition = category.name.tc;
            this.sequence = category.sequence;
            this.selectedCategory = category.category;
            if(category.image) {
              this.images.push(category.image);
            }
          }

        }
      );
    }
  }

  changeNavTab(tabName: string) {
    this.NavTab = tabName;
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  changeSelectedCategory(cat: any) {
    this.selectedCategory = cat;
  }

  addCategory() {
    // if(!this.wallet || !this.wallet.pwdHash) {
    //   this.router.navigate(['/wallet']);
    //   return;
    // }
    
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          

    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
      this.addCategoryDo(privateKey);
    });    
  }

  addCategoryDo(privateKey: any) {

    const data: any = {
      name: {
        en: this.name,
        sc: this.nameChinese,
        tc: this.nameTradition
      },
      sequence: this.sequence,
      image: (this.images && (this.images.length > 0)) ? this.images[0] : null,
      category: this.selectedCategory ? this.selectedCategory._id : null
    };

    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    if (! this.id) {
      this.categoryServ.create(data).subscribe(
        (res: any) => {
          console.log('res=', res);
          if (res && res._id) {
            this.router.navigate(['/merchant/categories']);
          }
        }
      );
    } else {
      this.categoryServ.update(this.id, data).subscribe(
        (res: any) => {
          console.log('res=', res);
          if (res && res._id) {
            this.router.navigate(['/merchant/categories']);
          }
        }
      );
    }

  }
}
