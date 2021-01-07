import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import {ActivatedRoute, Router, ParamMap} from '@angular/router';

@Component({
  selector: 'app-category2',
  templateUrl: './category2.component.html',
  styleUrls: ['./category2.component.css']
})
export class Category2Component implements OnInit {
  categories: any;
  category: any;
  mode: any;
  products: any;
  currentCatorory: any;
  categoryChildren: any;
  id: string;
  constructor(
    private router: Router, 
    private route:ActivatedRoute, 
    private productServ: ProductService,
    private categoryServ: CategoryService) { }

  ngOnInit() {
    this.mode = 'mode1';

    this.route.paramMap.subscribe((params: ParamMap) =>  {
      this.id = params.get('id');    
      this.categoryServ.getAdminCategoriesWithCount().subscribe(
        (res: any) => {
          if (res && res.ok) {
            const body = res._body;
            this.categories = body.filter(item => {
              return item.parentId == null || item.parentId == ''
            });


              this.category = body.filter(item => item._id === this.id)[0];
              this.currentCatorory = this.category;
              if(this.category.parentId) {
                this.category = body.filter(item => item._id === this.category.parentId)[0];
              }
              this.categoryChildren = body.filter(item => item.parentId === this.category._id);
            
            //
          }
        }
      );

      
      this.productServ.getCategoryProducts(this.id).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.products = res._body;
          }
      });
    });


  }

  changeMode(mode: string) {
    this.mode = mode;
  }
  navigateTo(category) {
    this.router.navigate(['/category/' + category._id]);
  }

}
