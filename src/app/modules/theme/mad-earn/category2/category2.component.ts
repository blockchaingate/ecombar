import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import {ActivatedRoute, Router, ParamMap} from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  selector: 'app-category2',
  templateUrl: './category2.component.html',
  styleUrls: ['./category2.component.css']
})
export class Category2Component implements OnInit {
  maxItems = 2;
  categories: any;
  category: any;
  
  products: any;
  brands: any;
  colors: any;
  title: any;
  storeId: string;
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
  
  currentCatorory: any;
  categoryChildren: any;
  id: string;
  constructor(
    private dataServ: DataService,
    private router: Router, 
    private route:ActivatedRoute, 
    private productServ: ProductService,
    private categoryServ: CategoryService) { }

  ngOnInit() {
    this.dataServ.currentStoreId.subscribe(
      (storeId: string) => {
        this.storeId = storeId;
      }
    );
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
              this.title = this.currentCatorory.category;
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

          }
      });
    });


  }


  navigateTo(category) {
    this.router.navigate(['/store' + this.storeId + '/category/' + category._id]);
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
