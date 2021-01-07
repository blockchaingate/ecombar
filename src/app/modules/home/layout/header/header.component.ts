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
  menu = false;
  _lang: string;

  constructor(private translate: TranslateService, private categoryServ: CategoryService, private storageServ: StorageService, private cartStoreServ: CartStoreService) {
    this.setLan();
  }

  ngOnInit(): void {
    this.storageServ.getUser().subscribe(
      (user: any) => {
        console.log('user=', user);
        this.user = user;
      }
    );
    console.log('uer=', this.storageServ.user);

    this.categoryServ.getAdminCategories().subscribe(
      (res: any) => {
        console.log('res=====', res);
        if (res && res.ok) {
          const body = res._body;
          this.categories = body.filter(item => {
            return item.parentId == null || item.parentId == ''
          });
          //
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

  openMenu(){
    console.log("Open Menu");
    this.menu = !this.menu;
  }

  closeMenu(){
    console.log("close Menu");
    this.menu = false;
  }

  setLan() {
    this._lang = this.storageServ.lang;

    if (!this._lang) {
      let lang = navigator.language.substr(0, 2).toLowerCase();
      if (lang === 'cn' || lang === 'zh') {
        lang = 'sc';
      }
      this._lang = lang;
    }

    this.translate.setDefaultLang( this._lang);
    this.translate.use( this._lang);
    this.storageServ.lang =  this._lang;
  }

  onChange(lan: string) {
    this._lang = lan;
    this.translate.setDefaultLang(lan);
    this.translate.use(lan);
    this.storageServ.lang = lan;
  }

}
