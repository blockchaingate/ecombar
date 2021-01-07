import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/category.service';
import {ActivatedRoute, Router, ParamMap} from '@angular/router';

@Component({
  selector: 'app-category2',
  templateUrl: './category2.component.html',
  styleUrls: ['./category2.component.css']
})
export class Category2Component implements OnInit {
  categories: any;
  category: any;
  currentCatorory: any;
  categoryChildren: any;
  id: string;
  constructor(private router: Router, private route:ActivatedRoute, private categoryServ: CategoryService) { }

  ngOnInit() {
    this.categoryServ.getAdminCategoriesWithCount().subscribe(
      (res: any) => {
        console.log('res=====', res);
        if (res && res.ok) {
          const body = res._body;
          this.categories = body.filter(item => {
            return item.parentId == null || item.parentId == ''
          });

          this.route.paramMap.subscribe((params: ParamMap) =>  {
            this.id = params.get('id');
            this.category = body.filter(item => item._id === this.id)[0];
            this.currentCatorory = this.category;
            console.log('this.category=', this.category);
            if(this.category.parentId) {
              this.category = body.filter(item => item._id === this.category.parentId)[0];
            }
            console.log('this.category222=', this.category);
            this.categoryChildren = body.filter(item => item.parentId === this.category._id);
          });
          //
        }
      }
    );

  }

  navigateTo(category) {
    this.router.navigate(['/category/' + category._id]);
  }

}
