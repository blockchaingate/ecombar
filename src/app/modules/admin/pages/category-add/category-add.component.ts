import { Component } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-category-add',
  providers: [CategoryService],
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent {
    name: string;

    constructor(
      private router: Router,
      private categoryServ: CategoryService) {

    }
    addProduct() {
        const data = {
          cat: this.name,
          typ: environment.cat_typ
        };
        this.categoryServ.create(data).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.router.navigate(['/admin/categories']);
            }
          }
        );
    }
}
