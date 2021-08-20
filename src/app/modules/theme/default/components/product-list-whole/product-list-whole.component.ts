import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
@Component({
  selector: 'app-product-list-whole',
  templateUrl: './product-list-whole.component.html',
  styleUrls: ['./product-list-whole.component.scss']
})

export class ProductListWholeComponent implements OnInit {
    @Input() products: any;
    @Input() title: any;
    currency: string;
    mode: any;
    pageNum: number;
    pageSize: number;
    pageCount: number;
    totalProductsCount: number;

    constructor(private dataServ: DataService) {}
    ngOnInit() {
        this.pageCount = 1;
        this.pageNum = 1;
        this.totalProductsCount = 0;
        this.pageSize = 20;
        this.mode = 'mode1';

        if(this.products) {
          this.pageCount = Math.ceil(this.products.length / this.pageSize);
          this.totalProductsCount = this.products.length;   
        }

        this.dataServ.currentStore.subscribe(
          (store: any) => {
            if(store) {
              this.currency = store.coin;
            }
            
          }
        );
     
    }

    changeMode(mode: string) {
        this.mode = mode;
      }
    
      changePageNum(num: number) {
        if(num < 1) {num = 1}
        if(num > this.pageCount) {num = this.pageCount}
        this.pageNum = num;
      }    
}
