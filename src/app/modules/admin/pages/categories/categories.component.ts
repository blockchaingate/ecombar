import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';

@Component({
  selector: 'app-admin-categories',
  providers: [CategoryService],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit{
  categories: any;
  constructor(
    private categoryServ: CategoryService) {
  }

  ngOnInit() {
    this.getCategories();
  }
  
  getCategories() {
    this.categoryServ.getCategories().subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.categories = res._body;
        }
      }
    );
  }
}
