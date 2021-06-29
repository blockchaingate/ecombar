import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { MerchantService } from '../../../shared/services/merchant.service';

@Component({
  selector: 'app-admin-categories',
  providers: [CategoryService],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any;
  constructor(
    private userServ: UserService,
    private merchantServ: MerchantService,
    private router: Router,
    private categoryServ: CategoryService) {
  }

  ngOnInit() {
    const merchantId = this.merchantServ.id;

    if (this.userServ.isSystemAdmin) {
      this.getAdminCategories();
    } else
    if (merchantId) {
        this.getMerchantCategories(merchantId);
    }
  }

  getMerchantCategories(merchantId: string) {
    this.categoryServ.getMerchantCategories(merchantId).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.categories = res._body;
        }
      }
    );
  }

  getAdminCategories() {
    this.categoryServ.getAdminCategories().subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.categories = res._body;
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
