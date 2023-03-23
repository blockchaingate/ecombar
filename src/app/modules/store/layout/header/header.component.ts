import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';

declare var $: any;

@Component({
  template:''
})
export class HeaderComponent implements OnInit {
  categories: any;
  cartCount: number;
  user: any;
  merchantId: string;
  categoryId: string;
  storeId: string;
  store: any;
  wallet: any;
  currencyBalance: number;
  searchText: string;
  currency: string;
  menu = false;
  _lang: string;
  tableNo: number;  // 台号 no

  constructor(
    private dataServ: DataService,
    private router: Router,
    private translate: TranslateService, 
    private cartStoreServ: CartStoreService,
    private categoryServ: CategoryService, 
    private storageServ: StorageService) {
    this.setLan();
  }

  ngOnInit(): void {
    this.dataServ.currentStore.subscribe(
      (store: any) => {
        if(store) {
          this.store = store;
          this.storeId = store._id;
          this.currency = store.coin;
        }

      }
    );

    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        if(wallet) {
          this.wallet = wallet;
        }
        
      }
    );
    this.dataServ.currencyBalance.subscribe(
      (currencyBalance: number) => {
        this.currencyBalance = currencyBalance;
      }
    );
    this.dataServ.currentStoreOwner.subscribe(
      (storeOwner: string) => {
        if(storeOwner) {
          this.categoryServ.getMerchantCategoriesTree(storeOwner).subscribe(
            (ret: any) => {
              if(ret) {
                console.log('ret of categories=', ret);
                const allCategories = ret;
                this.categories = allCategories;
                this.dataServ.changeStoreCategories(allCategories);
              }
            }
          );
        }
      }
    );

    this.cartStoreServ.items$.subscribe((res) => {
      this.cartCount = 0;
      if (!res || (res.length === 0)) {
        res = this.cartStoreServ.items;
      }

      if (res) {
        res.forEach(element => {
          this.cartCount += element.quantity;
        });
      }

    });

    setTimeout( () => {
      this.tableNo = this.cartStoreServ.getTableNo();  // 台号 no
    }, 1000);  // 给个延时

  }


  getLogo(currency) {
    if(currency) {
      return 'https://www.exchangily.com/assets/coins/' + currency.toLowerCase() + '.png';
    }
    return '';
  }



  openMenu(){
    this.menu = !this.menu;
  }

  closeMenu(){
    this.menu = false;
  }

  onSearch() {
    const query = { text: this.searchText};
    if(this.categoryId) {
      query['categoryId'] = this.categoryId;
    }
    this.router.navigate(['/store/' + this.storeId + '/search', query]);
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
