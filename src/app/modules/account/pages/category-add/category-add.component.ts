import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { StorageService } from '../../../shared/services/storage.service';
import { MerchantService } from '../../../shared/services/merchant.service';

@Component({
  selector: 'app-admin-category-add',
  providers: [CategoryService],
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class CategoryAddComponent implements OnInit {
  sequence: number;
  categories: any;
  images: any;
  category: string;
  categoryChinese: string;
  parentId: string;
  currentTab: string;
  id: string;

  constructor(
    private userServ: UserService,
    private merchantServ: MerchantService,
    private route: ActivatedRoute,
    private router: Router,
    private storageServ: StorageService,
    private categoryServ: CategoryService) {
  }

  ngOnInit() {
    this.images = [];
    this.currentTab = 'default';
    const merchantId = this.merchantServ.id;

    this.storageServ.checkSystemAdmin().subscribe(
      (ret) => {
        if (ret) {
          this.categoryServ.getAdminCategories().subscribe(
            (res: any) => {
              if (res && res.ok) {
                this.categories = res._body;
              }
            }
          );
        } else if (merchantId) {
          this.categoryServ.getMerchantCategories(merchantId).subscribe(
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
          console.log('ressssss=', res);
          if (res && res.ok) {
            const category = res._body;
            console.log('cateogryyy=', category);
            this.category = category.category.en;
            this.categoryChinese = category.category.sc;
            this.sequence = category.sequence;
            this.parentId = category.parentId;
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

  addProduct() {
    const data = {
      category: {
        en: this.category,
        sc: this.categoryChinese
      },
      sequence: this.sequence,
      thumbnailUrl: (this.images && (this.images.length > 0)) ? this.images[0] : null,
      parentId: this.parentId
    };
    if (!this.id) {

      this.categoryServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/admin/categories']);
          }
        }
      );
    } else {
      this.categoryServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/admin/categories']);
          }
        }
      );
    }

  }
}
