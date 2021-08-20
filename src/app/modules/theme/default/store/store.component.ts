import { Component, OnInit } from '@angular/core';
import { MainLayoutService } from 'src/app/modules/shared/services/mainlayout.service';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  id: string;
  categories: any;
  mainLayouts: any;

  constructor(
    private mainLayoutServ: MainLayoutService,
    private productServ: ProductService,
    private route: ActivatedRoute
    ) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    
    this.productServ.getAdminHotCategories().subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.categories = res._body;
        }
      }
    );

    this.mainLayoutServ.getMerchantMainLayouts(this.id).subscribe(
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