import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { MainLayoutService } from '../../shared/services/mainlayout.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit{
  categories: any;
  mainLayouts: any;
  constructor(
    private mainLayoutServ: MainLayoutService,
    private productServ: ProductService) {

  }
  ngOnInit() {
    this.productServ.getAdminHotCategories().subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.categories = res._body;
          console.log('this.categories==', this.categories);
        }
      }
    );

    this.mainLayoutServ.getAdminMainLayouts().subscribe(
      (res:any) => {
        console.log('resss=', res);
        if(res.ok) {
          this.mainLayouts = res._body;
          console.log('this.mainLayouts=', this.mainLayouts);
          
        }
      }
    );    
  }
}
