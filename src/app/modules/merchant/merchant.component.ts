import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { MerchantService } from '../shared/services/merchant.service';
import { StorageService } from '../shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../store/states/user.state';
import { logout, updateMerchantStatus } from '../../store/actions/user.actions';
import { DataService } from '../shared/services/data.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { StoreService } from '../shared/services/store.service';

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
  dropDownActive = false;
  //displayName: string;
  merchantId: string;

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
    private localSt: LocalStorage,
    private storeServ: StoreService, 
    private dataServ: DataService,
    private storageServ: StorageService
  ) { }

  toggle(menu: string) {
    if(this.extendedMenu == menu) {
      this.extendedMenu = '';
    } else {
      this.extendedMenu = menu;
    }
  }
  async ngOnInit() {
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
          {
            title: 'Store',
            link: 'store',
            icon: 'store'
          },  
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
            title: 'Ships',
            link: 'ships',
            icon: 'order'
          }     
        ]
      },
      {
        title: 'Main Page',
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
