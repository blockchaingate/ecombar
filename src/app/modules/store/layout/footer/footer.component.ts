import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  storeId: string;
  categories1: any;
  categories2: any;
  store: any;
  constructor(private dataServ: DataService) {}
  ngOnInit() {
    this.dataServ.currentStore.subscribe(
      (store: any) => {
        if(store) {
          this.storeId = store._id;
          this.store = store;
        }
      }
    );

    this.categories1 = [];
    this.categories2 = [];
    this.dataServ.currentStoreCategories.subscribe(
      (categories: any) => {
        const allCategories = categories.filter(item => !item.parentId);
        for(let i = 0; i < allCategories.length; i++) {
          const category = allCategories[i];
          if(i % 2 == 0) {
            this.categories1.push(category);
          } else {
            this.categories2.push(category);
          }
        }
      }
    );
  }

}
