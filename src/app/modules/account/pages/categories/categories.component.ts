import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';

@Component({
  selector: 'app-admin-categories',
  providers: [CategoryService],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss', ]
})
export class CategoriesComponent implements OnInit {
  categories: any;
  constructor(
    private merchantServ: MerchantService,
    private router: Router,
    private storageServ: StorageService,
    private categoryServ: CategoryService) {
  }

  ngOnInit() {
    this.categories = [];
    const merchantId = this.merchantServ.id;


    this.storageServ.checkSystemAdmin().subscribe(
      (ret) => {
        if (ret) {
          this.getAdminCategories();
        } else
        if (merchantId) {
          //this.getAdminCategories();
          this.getMerchantCategories(merchantId);
        }
      }
    );

  }

  getMerchantCategories(merchantId: string) {
    this.categoryServ.getMerchantCategories(merchantId).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.categories = this.categories.concat(res._body);
        }
      }
    );
  }

  getAdminCategories() {
    this.categoryServ.getAdminCategories().subscribe(
      (res: any) => {
        if (res && res.ok) {
          const categories = res._body;
          const adminCategories = categories.map(item => {
            item.admin = true;
            return item;
          });
          this.categories = this.categories.concat(adminCategories);
        }
      }
    );
  }

  editCategory(category) {
    this.router.navigate(['/admin/category/' + category._id + '/edit']);
  }

  deleteCategory(category) {
    this.categoryServ.deleteCategory(category._id).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.categories = this.categories.filter((item) => item._id != category._id);
        }
      }
    );
  }
}
