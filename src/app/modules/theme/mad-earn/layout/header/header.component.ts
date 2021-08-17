import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserState } from 'src/app/store/states/user.state';
import { selectMerchantId } from 'src/app/store/selectors/user.selector';

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
  searchText: string;
  menu = false;
  _lang: string;
  isSearch = false;

  constructor(
    private store: Store<{ user: UserState }>,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private translate: TranslateService, 
    private categoryServ: CategoryService, 
    private storageServ: StorageService, 
    private cartStoreServ: CartStoreService) {
    this.setLan();
  }

  ngOnInit(): void {
    this.categoryId = '';
    this.store.select('user').subscribe(
      (userState: UserState) => {
        const role = userState.role;
        if(role) {
          this.user = true;
        }
        
        this.initMenu();


    
      }
    );

    /*
    this.storageServ.getUser().subscribe(
      (user: any) => {
        console.log('user=', user);
        this.user = user;
      }
    );
    */







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


  initMenu() {
    this.merchantId = '';
    if(!this.merchantId) {
      const currentURL= window.location.href; 
      const storeIndex = currentURL.indexOf('store/');
      if(storeIndex > 0) {
        this.merchantId = currentURL.substring(storeIndex + 6);
      }
    }

    
    console.log();
    if(!this.merchantId) {
      this.categoryServ.getAdminCategories().subscribe(
        (res: any) => {
          if (res && res.ok) {
            const allCategories = res._body;
            this.buildCategoryTree(allCategories);
            this.cd.detectChanges();
            $('.selectpicker').selectpicker('refresh');
          }
        }
      );
    } else {
      this.categoryServ.getMerchantCategories(this.merchantId).subscribe(
        (res: any) => {
          if (res && res.ok) {
            const allCategories = res._body;
            this.buildCategoryTree(allCategories);
            this.cd.detectChanges();
          }
        }
      );     
    }
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
    this.router.navigate(['/search', { text: this.searchText, categoryId: this.categoryId, merchantId: this.merchantId??'' }]);
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

  toogleSearch(){
    console.log("toogleSearch: "+ this.isSearch);
     
    this.isSearch = !this.isSearch;

  }

}
