import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { NewsletterService } from 'src/app/modules/shared/services/newsletter.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  storeId: string;
  storeOwner: string;
  email: string;
  categories1: any;
  categories2: any;
  store: any;
  constructor(
    private toastr: ToastrService,
    private newsletterServ: NewsletterService,
    private dataServ: DataService) {}
  ngOnInit() {
    this.dataServ.currentStore.subscribe(
      (store: any) => {
        if(store) {
          this.storeId = store._id;
          this.storeOwner = store.owner;
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

  subscribe() {
    const data = {
      email: this.email,
      store: this.storeId,
      storeOwner: this.storeOwner
    }
    this.newsletterServ.create(data).subscribe(
      (ret: any) => {
        if(ret) {
          if(ret.ok) {
            this.toastr.success("You subscribe to our newletter successfully.");
            this.email = '';
          } else {
            this.toastr.error(ret.error);
          }
        }
      }
    );
  }
}
