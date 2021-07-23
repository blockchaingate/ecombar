import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  mode: string;
  products: any;  
  constructor(private cd: ChangeDetectorRef, private productServ: ProductService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.mode = 'mode1';
    this.route.paramMap.subscribe((params: any) => {
        const parameters = params.params;
        const searchText = parameters.text;
        const categoryId = parameters.categoryId;
        const merchantId = parameters.merchantId;

        this.productServ.search(searchText, categoryId, merchantId).subscribe(
            (res: any) => {
                if(res && res.ok) {
                    this.products = res._body;
                    console.log('this.products333==', this.products);
                    this.cd.detectChanges();
                }
            }
        );
    })
  }

}
