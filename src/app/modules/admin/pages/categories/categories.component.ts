import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-admin-categories',
  providers: [CategoryService],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss', '../../../../../table.scss', '../../../../../button.scss']
})
export class CategoriesComponent implements OnInit{
  categories: any;
  constructor(
    private userServ: UserService,
    private router: Router,
    private categoryServ: CategoryService) {
  }

  ngOnInit() {

    this.userServ.getToken().subscribe(
      (token: any) => {
        const decoded = this.userServ.decodeToken(token);
        const aud = decoded.aud;
        const merchantId = decoded.merchantId;

        if (aud == 'isSystemAdmin') {
          this.getAdminCategories();
        }  else 
        if (merchantId) {
          this.getMerchantCategories(merchantId);
        }
      } 
    );
  }

  getMerchantCategories(merchantId: string) {
    this.categoryServ.getMerchantCategories(merchantId).subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.categories = res._body;
        }
      }
    );
  }  

  getAdminCategories() {
    this.categoryServ.getAdminCategories().subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.categories = res._body;
        }
      }
    );
  }

  edit(category) {
    this.router.navigate(['/admin/category/' + category._id + '/edit']);
  }
}
