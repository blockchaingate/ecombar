import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
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
          console.log('store=====', store);
        }

      }
    );

    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        if(wallet) {
          console.log('wallethhhh===', wallet);
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
        console.log('storeOwner in here =', storeOwner);
        if(storeOwner) {
          this.categoryServ.getMerchantCategories(storeOwner).subscribe(
            (ret: any) => {
              console.log('ret for caaat=', ret);
              if(ret && ret.ok) {
                const allCategories = ret._body;
                this.dataServ.changeStoreCategories(allCategories);
                this.buildCategoryTree(allCategories);
              }
            }
          );
        }
      }
    );

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


  getLogo(currency) {
    if(currency) {
      return 'https://www.exchangily.com/assets/coins/' + currency.toLowerCase() + '.png';
    }
    return '';
  }

  arrayToTree(items) {
 
    /**
     * The nested tree.
     * @type {*[]}
     */
    const rootItems = [];
 
    // (1) Create a holder for each item.
 
    const lookup = {};
 
    for (const item of items) {
 
        const itemId   = item["_id"];
        const parentId = item["parentId"];
 
        // (2) Create a placeholder for each item in the lookup. 
        // Details are added later.
 
        if (! lookup[itemId]) lookup[itemId] = { ["children"]: [] }
 
        // (3) Add the details of the item.
 
        lookup[itemId] = { ...item, ["children"]: lookup[itemId]["children"] }
 
        // (4) Create a variable for the current item.
 
        const TreeItem = lookup[itemId];
 
        // (5) Determine where the item goes in the tree. 
 
        // If the item has no parentId, it is the root node.
        if (parentId === null || parentId === undefined || parentId === "") {
 
            rootItems.push(TreeItem);
        }
 
        /*
         * If the item has a parentId, add it to the tree.
         */
 
        else {
 
            // (6) Add a placeholder for parent of the current item.
 
            if (! lookup[parentId]) lookup[parentId] = { ["children"]: [] };
 
            // (7) Add the current item to its parent.
 
            lookup[parentId]["children"].push(TreeItem);
        }
    }
 
    return rootItems
}




  buildCategoryTree(allCategories: any) {
    this.categories = this.arrayToTree(allCategories);
    console.log('this.categories==', this.categories);
  }

  openMenu(){
    console.log("Open Menu");
    this.menu = !this.menu;
  }

  closeMenu(){
    console.log("close Menu");
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
