
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { StoreService } from 'src/app/modules/shared/services/store.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { MyStore } from './mock-merchant';    // 虚拟商家数据（测试）

@Component({
  providers: [],
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {
  merchant: any;    // 商家信息
  extendedMenu: string;
  isCollapsed = false;
  showNavMenu = false;
  wallets: any;
  wallet: any;
  dropDownActive = false;
  //displayName: string;
  merchantId: string;
  year = 2022;
  /*
  myPhotoUrlSelect: Observable<string>;
  displayNameSelect: Observable<string>;
  roleSelect: Observable<string>;
  */

  role: string;
  myPhotoUrl: string;
  displayName: string;
  merchantStatus: string;

  menuItems: any;

  constructor(
    private router: Router, 
    private translateServ: TranslateService, 
    private dataServ: DataService,
    private storeServ: StoreService,
    private storageServ: StorageService,
    private localSt: LocalStorage
  ) { }

  toggle(menu: string) {
    if(this.extendedMenu == menu) {
      this.extendedMenu = '';
    } else {
      this.extendedMenu = menu;
    }
  }

  changeWallet(index: number, wallet: any) {
    this.wallets.currentIndex = index;
    this.localSt.setItem('ecomwallets', this.wallets).subscribe(() => {
    });  
    this.dataServ.changeWallet(wallet);
    const addresses = wallet.addresses;
    const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
    const walletAddress = walletAddressItem.address;
    if(walletAddress) {
      console.log('walletAddress====', walletAddress);
      this.dataServ.changeWalletAddress(walletAddress); 

      this.storeServ.getStoresByAddress(walletAddress).subscribe(
        (ret: any) => {
          console.log('rettttt=', ret);
          if(ret && ret.length > 0) {
            const store = ret[0];
            this.dataServ.changeMyStore(store);

            // this.merchant = MyStore;    // 虚拟商家信息（测试）
            // this.merchant = ret;
          }
        });

    }
  }

  async ngOnInit() {
    this.year = (new Date()).getFullYear();
    this.dataServ.currentWallets.subscribe(
      (wallets: any) => {
        this.wallets = wallets;
        console.log('wallets=', wallets);
      }
    )

    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;

      }
    );
    this.menuItems = [
      {
        title: 'Dashboard',
        link: 'dashboard',
        icon: 'dashboard',
        line: 1,  // 下边线支持
      },
      // ---------- ---------- 二级菜单，改为一级 ---------- ----------
      // {
      //   title: 'Catelog',
      //   icon: 'dashboard',
      //   items: [
      //     // {
      //     //   title: 'Store',
      //     //   link: 'store',
      //     //   icon: 'store'
      //     // }, 
          {
            title: 'Categories',
            link: 'categories',
            icon: 'category'
          },    
          {
            title: 'Products',
            link: 'products',
            icon: 'product'
          },
          {
            title: 'Brands',
            link: 'brands',
            icon: 'brand'
          },
          { // Memo: 缺个台号管理，不惊动后端了
            title: 'Table Numbers',  // 'Shipping Carriers'
            link: 'shipping-carriers',  // 'shipping-carriers'
            icon: 'category'  // 'order'
          },
          {
            title: 'Status',
            link: 'order-state',
            icon: 'order'
          },
          {
            title: 'Orders',
            link: 'orders',
            icon: 'order'
          },
          {
            title: 'Food Items',
            link: 'food-list',
            icon: 'order'
          },
      //     {
      //       title: 'Ships',
      //       link: 'ships',
      //       icon: 'order'
      //     },
      //     {
      //       title: 'Newsletters',
      //       link: 'newsletters',
      //       icon: 'order'
      //     }
      //   ]
      // },
      // ---------- ---------- 删除“Home Page”菜单 ---------- ----------
      // {
      //   title: 'Home Page',
      //   icon: 'dashboard',
      //   items: [
      //     {
      //       title: 'Banners',
      //       link: 'banners',
      //       icon: 'banner'
      //     },
      //     {
      //       title: 'Small Banners',
      //       link: 'small-banners',
      //       icon: 'banner'
      //     },  
      //     {
      //       title: 'Top Category Banners',
      //       link: 'top-category-banners',
      //       icon: 'banner'
      //     },    
      //     {
      //       title: 'Features',
      //       link: 'features',
      //       icon: 'banner'
      //     },
      //     {
      //       title: 'Main Layout',
      //       link: 'main-layout',
      //       icon: 'category'
      //     },        
      //     {
      //       title: 'Collections',
      //       link: 'collections',
      //       icon: 'collection'
      //     },  
      //   ]
      // },
      // ---------- ---------- 删除“Content”菜单 ---------- ----------
      // {
      //   title: 'Content',
      //   icon: 'dashboard',
      //   items: [
      //     {
      //       title: 'Customer Service',
      //       link: 'customer-service',
      //       icon: 'order'
      //     },
      //     {
      //       title: 'Returns policy',
      //       link: 'returns-policy',
      //       icon: 'order'
      //     },
      //     {
      //       title: 'Faq',
      //       link: 'faq',
      //       icon: 'order'
      //     } 
      //   ]        
      // }
    ];

    const lang = this.storageServ.lang;
    if (!lang) {
      this.storageServ.get('_lang').subscribe(
        (lang2: string) => {
          if (lang2) {
            this.translateServ.setDefaultLang(lang2);
          }

        }
      );
    } else {
      this.translateServ.setDefaultLang(lang);
    }

    this.merchant = MyStore;    // 虚拟商家信息（测试）

  }

  changeLang() {
    let lang = this.translateServ.getDefaultLang();
    lang = (lang === 'en') ? 'sc' : 'en';
    this.translateServ.setDefaultLang(lang);
    this.storageServ.lang = lang;
  }

  logout(): void {
    //this.store.dispatch(logout());
    this.router.navigate(['/auth/signin']);
  }

  profile(): void {
    this.router.navigate(['/merchant/profile']);
  }

  toggleShowNavMenu(): void {
    this.showNavMenu = !this.showNavMenu;
  }

  toggleDropDownActive(): void {
    this.dropDownActive = !this.dropDownActive;
  }
}
