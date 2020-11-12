import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService } from '../../../shared/services/category.service';
import { CartStoreService } from '../../../shared/services/cart.store.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  categories: [];
  cartCount: number;
  user: any;

  constructor(
    private translateServ: TranslateService,
    private categoryServ: CategoryService,
    private storageServ: StorageService,
    private cartStoreServ: CartStoreService) {
  }

  _lang: string;
  get lang(): string {
    return this._lang;
  }

  set lang(value: string) {
    this._lang = value;
    // console.log('go set lang', value);
    this.storageServ.lang = value;
    this.translateServ.setDefaultLang(value);
  }

  ngOnInit(): void {
    this.storageServ.getUser().subscribe(
      (user: any) => {
        console.log('user=', user);
        this.user = user;
      }
    );
    console.log('uer=', this.storageServ.user);
    this.lang = this.storageServ.lang || this.translateServ.getDefaultLang();
    this.translateServ.setDefaultLang(this._lang);

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
      console.log('this.images4');
      if (!res || (res.length === 0)) {
        console.log('yes');
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
