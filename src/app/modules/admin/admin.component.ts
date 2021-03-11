import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { MerchantService } from '../shared/services/merchant.service';
import { StorageService } from '../shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../store/states/user.state';
import { selectUserRole, selectMyPhotoUrl, selectDisplayName } from '../../store/selectors/user.selector';
@Component({
  providers: [UserService],
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
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

  menuItems: any;
  constructor(
    private store: Store<{ user: UserState }>,
    private router: Router, 
    private translateServ: TranslateService, 
    private merchantServ: MerchantService,
    private userServ: UserService, 
    private storageServ: StorageService
  ) { }

  ngOnInit(): void {
    //this.userState$ = this.store.select('user');
    const roleSelect = this.store.select(selectUserRole);
    const myPhotoUrlSelect = this.store.select(selectMyPhotoUrl);
    const displayNameSelect = this.store.select(selectDisplayName);

    roleSelect.subscribe(
      (res: string) => {
        this.role = res;
      }
    );

    displayNameSelect.subscribe(
      (res: string) => {
        this.displayName = res;
      }
    );

    myPhotoUrlSelect.subscribe(
      (res: string) => {
        this.myPhotoUrl = res;
      }
    );

    this.menuItems = [
      {
        title: 'Dashboard',
        link: 'dashboard',
        icon: 'dashboard',
        roles: ['Admin', 'Merchant', 'Customer']
      },
      {
        title: 'Banners',
        link: 'banners',
        icon: 'banner',
        roles: ['Admin', 'Merchant']
      },
      {
        title: 'Brands',
        link: 'brands',
        icon: 'brand',
        roles: ['Admin', 'Merchant']
      },
      {
        title: 'Main Layout',
        link: 'main-layout',
        icon: 'category',
        roles: ['Admin', 'Merchant']
      },        
      {
        title: 'Categories',
        link: 'categories',
        icon: 'category',
        roles: ['Admin', 'Merchant']
      },
      {
        title: 'Collections',
        link: 'collections',
        icon: 'collection',
        roles: ['Admin', 'Merchant']
      },
      {
        title: 'Users',
        link: 'users',
        icon: 'user',
        roles: ['Admin']
      },
      {
        title: 'Merchant Applications',
        link: 'merchant-applications',
        icon: 'user',
        roles: ['Admin']
      },       
      {
        title: 'Orders',
        link: 'orders',
        icon: 'order',
        roles: ['Admin', 'Merchant', 'Customer']
      },
      {
        title: 'My assets',
        link: 'my-assets',
        icon: 'asset',
        roles: ['Admin', 'Merchant']
      },
      {
        title: 'Merchant information',
        link: 'merchant-info',
        icon: 'information',
        roles: ['Merchant']
      },

      {
        title: 'Address',
        link: 'address',
        icon: 'address',
        roles: ['Customer']
      },

      {
        title: 'My assets',
        link: 'my-assets',
        icon: 'asset',
        roles: ['Customer']
      },
      {
        title: 'My cart',
        link: 'cart',
        icon: 'cart',
        roles: ['Customer']
      },
      {
        title: 'My favorite',
        link: 'favorite',
        icon: 'favorite',
        roles: ['Customer']
      },
      {
        title: 'My products',
        link: 'my-products',
        icon: 'product',
        roles: ['Customer']
      },
      {
        title: 'My comments',
        link: 'my-comments',
        icon: 'comment',
        roles: ['Customer'] 
      }      
    ];


    /*
    this.store.subscribe((res: any) => {
      console.log('res in store=', res);
    }
    );
    */
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
    this.userServ.logout();
    this.router.navigate(['/auth/signin']);
  }

  profile(): void {
    this.router.navigate(['/admin/profile']);
  }

  toggleShowNavMenu(): void {
    this.showNavMenu = !this.showNavMenu;
  }

  toggleDropDownActive(): void {
    this.dropDownActive = !this.dropDownActive;
  }
}
