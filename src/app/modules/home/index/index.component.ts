import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit{
  categories: any;

  constructor(private productServ: ProductService) {

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
  }
}
