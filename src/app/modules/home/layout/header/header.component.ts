import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService } from '../../../shared/services/category.service';
import { CartStoreService } from '../../../shared/services/cart.store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  categories: [];
  cartCount: number;

  constructor(private translateServ: TranslateService, private categoryServ: CategoryService, private cartStoreServ: CartStoreService) {
  }

  _lang: string;
  get lang(): string {
    return this._lang;
  }

  set lang(value: string) {
    this._lang = value;
    console.log('go set lang', value);
    this.translateServ.setDefaultLang(value);
  }

  ngOnInit() {
    this.lang = this.translateServ.getDefaultLang();
    this.categoryServ.getAdminCategories().subscribe(
      (res: any) => {
        console.log('res=====', res);
        if (res && res.ok) {
          this.categories = res._body;
        }
      }
    );

    console.log('this.cartStoreServ.items===', this.cartStoreServ.items);

    this.cartStoreServ.items$.subscribe((res) => {
      this.cartCount = 0;
      if (!res || res.length === 0) {
        res = this.cartStoreServ.items;
      }

      if (res) {
        res.forEach(element => {
          this.cartCount += element.quantity;
        });
      }

    });

  }
}
