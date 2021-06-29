import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { MerchantService } from '../shared/services/merchant.service';
import { StorageService } from '../shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { IGNORE_BLOCK_TAGS } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  providers: [UserService],
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  showNavMenu = false;
  dropDownActive = false;
  displayName: string;
  myPhotoUrl: string;
  email: string;
  role: string;

  menuItems: any;
  constructor(private router: Router, private translateServ: TranslateService, private merchantServ: MerchantService,
              private userServ: UserService, private storageServ: StorageService
  ) { }

  ngOnInit(): void {
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

    this.email = this.userServ.email;
    this.displayName = this.userServ.displayName;
    if (!this.email) {
      this.storageServ.get('_user').subscribe(
        (user: any) => {
          this.email = user.email;
          this.displayName = user.displayName;
        }
      );
    }

    this.userServ.getMe().subscribe(
      (res: any) => {
        if (res && res.ok) {
          const user = res._body;
          this.myPhotoUrl = user.myPhotoUrl;
        }
      }
    );

    let merchantId = this.merchantServ.id;
    if (!merchantId) {
      this.storageServ.get('_merchantId').subscribe(
        (ret: any) => {
          merchantId = ret;
          this.initMenu(merchantId);
        }
      );
    } else {
      this.initMenu(merchantId);
    }

  }

  changeLang() {
    let lang = this.translateServ.getDefaultLang();
    lang = (lang === 'en') ? 'sc' : 'en';
    this.translateServ.setDefaultLang(lang);
    this.storageServ.lang = lang;
  }

  initMenuWithSystemAdmin(merchantId: string, isSystemAdmin: boolean) {
    if (isSystemAdmin) {
      this.role = 'Admin';
      this.menuItems = [
        {
          title: 'Dashboard',
          link: 'dashboard',
          icon: 'dashboard'
        },
        {
          title: 'Banners',
          link: 'banners',
          icon: 'banner'
        },
        {
          title: 'Brands',
          link: 'brands',
          icon: 'brand'
        },
        {
          title: 'Categories',
          link: 'categories',
          icon: 'category'
        },
        {
          title: 'Collections',
          link: 'collections',
          icon: 'collection'
        },
        {
          title: 'Users',
          link: 'users',
          icon: 'user'
        },
        {
          title: 'Orders',
          link: 'orders',
          icon: 'order'
        }
      ];
    } else if (merchantId) {
        this.role = 'Merchant';
        this.menuItems = [
          {
            title: 'Dashboard',
            link: 'dashboard',
            icon: 'dashboard'
          },
          {
            title: 'Banners',
            link: 'banners',
            icon: 'banner'
          },
          {
            title: 'Brands',
            link: 'brands',
            icon: 'brand'
          },
          {
            title: 'Categories',
            link: 'categories',
            icon: 'category'
          },
          {
            title: 'Collections',
            link: 'collections',
            icon: 'collection'
          },
          {
            title: 'My assets',
            link: 'my-assets',
            icon: 'asset'
          },
          {
            title: 'Products',
            link: 'products',
            icon: 'product'
          },
          {
            title: 'Orders',
            link: 'orders',
            icon: 'order'
          },
          {
            title: 'Merchant information',
            link: 'merchant-info',
            icon: 'information'
          }
        ];
      } else {
        this.role = 'Customer';
        this.menuItems = [
          {
            title: 'Dashboard',
            link: 'dashboard',
            icon: 'dashboard'
          },
          {
            title: 'Address',
            link: 'address',
            icon: 'address'
          },
          {
            title: 'Orders',
            link: 'orders',
            icon: 'order'
          },
          {
            title: 'My assets',
            link: 'my-assets',
            icon: 'asset'
          },
          {
            title: 'My cart',
            link: 'cart',
            icon: 'cart'
          },
          {
            title: 'My favorite',
            link: 'favorite',
            icon: 'favorite'
          },
          {
            title: 'My products',
            link: 'my-products',
            icon: 'product'
          },
          {
            title: 'My comments',
            link: 'my-comments',
            icon: 'comment'
          }
        ];
      }
  }

  initMenu(merchantId: string) {

    if (this.userServ.isSystemAdmin) {
      this.initMenuWithSystemAdmin(merchantId, this.userServ.isSystemAdmin);

    } else {
      this.storageServ.get('_isSystemAdmin').subscribe(
        (ret: boolean) => {
          this.initMenuWithSystemAdmin(merchantId, ret);
        }
      );
    }
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
