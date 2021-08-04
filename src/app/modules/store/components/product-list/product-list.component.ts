import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {
    @Input() mode: string;
    @Input() products: any;
    storeId: string;
    
    constructor(private dataServ: DataService) {}
    ngOnInit() {
      this.dataServ.currentStoreId.subscribe(
        (storeId: string) => {
          this.storeId = storeId;
        }
      );
    }
}
