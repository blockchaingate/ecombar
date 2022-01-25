import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { StoreService } from 'src/app/modules/shared/services/store.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  providers: [],
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {
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
    console.log('walletAddress==', walletAddress);
    if(walletAddress) {
      this.dataServ.changeWalletAddress(walletAddress); 

      this.storeServ.getStoresByAddress(walletAddress).subscribe(
        (ret: any) => {
          console.log('ret for store==', ret);
          if(ret && ret.ok && ret._body && ret._body.length > 0) {
            const store = ret._body[ret._body.length - 1];
            console.log('store in here==', store);
            this.dataServ.changeMyStore(store);
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
        icon: 'dashboard'
      },
      {
        title: 'Catelog',
        icon: 'dashboard',
        items: [
          /*
          {
            title: 'Store',
            link: 'store',
            icon: 'store'
          }, 
          */ 
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
          {
            title: 'Orders',
            link: 'orders',
            icon: 'order'
          },
          {
            title: 'Shipping Carriers',
            link: 'shipping-carriers',
            icon: 'order'
          },
          {
            title: 'Ships',
            link: 'ships',
            icon: 'order'
          },
          {
            title: 'Newsletters',
            link: 'newsletters',
            icon: 'order'
          }      
        ]
      },
      {
        title: 'Home Page',
        icon: 'dashboard',
        items: [
          {
            title: 'Banners',
            link: 'banners',
            icon: 'banner'
          },
          {
            title: 'Small Banners',
            link: 'small-banners',
            icon: 'banner'
          },  
          {
            title: 'Top Category Banners',
            link: 'top-category-banners',
            icon: 'banner'
          },    
          {
            title: 'Features',
            link: 'features',
            icon: 'banner'
          },
          {
            title: 'Main Layout',
            link: 'main-layout',
            icon: 'category'
          },        
          {
            title: 'Collections',
            link: 'collections',
            icon: 'collection'
          },  
        ]
      },
      {
        title: 'Content',
        icon: 'dashboard',
        items: [
          {
            title: 'Customer Service',
            link: 'customer-service',
            icon: 'order'
          },
          {
            title: 'Returns policy',
            link: 'returns-policy',
            icon: 'order'
          },
          {
            title: 'Faq',
            link: 'faq',
            icon: 'order'
          } 
        ]        
      }
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
