import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  mode: string;
  products: any;  
  constructor(
    private dataServ: DataService,
    private cd: ChangeDetectorRef, 
    private productServ: ProductService, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.mode = 'mode1';
    this.dataServ.currentStoreOwner.subscribe(
      (owner: string) => {
        if(owner) {
          this.route.paramMap.subscribe((params: any) => {
            console.log('params2===', params);
              const parameters = params.params;
              const searchText = parameters.text ? parameters.text : '';
              const categoryId = parameters.categoryId ? parameters.categoryId : null;
              this.productServ.search(searchText, categoryId, owner).subscribe(
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
    );

  }

}
