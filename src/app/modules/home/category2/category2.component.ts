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
  maxItems = 2;
  categories: any;
  category: any;
  mode: any;
  products: any;
  pageNum: number;
  pageSize: number;
  pageCount: number;
  brands: any;
  colors: any;
  prices = [
    {
      name: 'Under $25',
      max: 25,
      isChecked: false
    },
    {
      name: '$25 to $50',
      min: 25,
      max: 50,
      isChecked: false
    },
    {
      name: '$50 to $100',
      min: 50,
      max: 100,
      isChecked: false
    },
    {
      name: '$100 to $200',
      min: 100,
      max: 200,
      isChecked: false
    },
    {
      name: '$200 & Above',
      min: 200,
      isChecked: false
    }
  ];
  totalProductsCount: number;
  currentCatorory: any;
  categoryChildren: any;
  id: string;
  constructor(
    private router: Router, 
    private route:ActivatedRoute, 
    private productServ: ProductService,
    private categoryServ: CategoryService) { }

  ngOnInit() {
    this.pageCount = 1;
    this.pageNum = 1;
    this.totalProductsCount = 0;
    this.pageSize = 20;
    this.mode = 'mode1';
    this.products = [];
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
            /*
            const product = res._body[0];
            for(let i=0;i<68;i++) {
              this.products.push(product);
            }
            */
           const body = res._body;
           this.products = body.products;
           this.brands = body.brands;
           this.colors = body.colors;
            //this.products = res._body;
            this.pageCount = Math.ceil(this.products.length / this.pageSize);
            this.totalProductsCount = this.products.length;
          }
      });
    });


  }

  changeMode(mode: string) {
    this.mode = mode;
  }

  changePageNum(num: number) {
    if(num < 1) {num = 1}
    if(num > this.pageCount) {num = this.pageCount}
    this.pageNum = num;
  }
  navigateTo(category) {
    this.router.navigate(['/category/' + category._id]);
  }

  filter() {
    console.log('brands=', this.brands);
    console.log('colors=', this.colors);
    console.log('prices=', this.prices);

    const brands = [];
    for(let i=0;i<this.brands.length;i++) {
      const brand = this.brands[i];
      if(brand.isChecked) {
        brands.push(brand.name._id);
      }
    }

    
    const colors = [];
    for(let i=0;i<this.colors.length;i++) {
      const color = this.colors[i];
      if(color.isChecked) {
        colors.push(color.name);
      }
    }

    
    const prices = [];
    for(let i=0;i<this.prices.length;i++) {
      const price = this.prices[i];
      if(price.isChecked) {
        prices.push({
          min: price.min,
          max: price.max
        });
      }
    }


    this.productServ.customSearch(this.id, brands, colors, prices).subscribe(
      res => {
        if (res && res.ok) {
         const body = res._body;
         this.products = body;   
        }     
      }      
    );
  }

}
