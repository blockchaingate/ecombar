import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { MerchantService } from '../shared/services/merchant.service';
import { StorageService } from '../shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';

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

  menuItems: any;
  constructor(
    private router: Router,
    private translateServ: TranslateService,
    private merchantServ: MerchantService,
    private userServ: UserService,
    private storageServ: StorageService
  ) { }

  ngOnInit(): void {


    this.email = this.userServ.email;
    this.displayName = this.userServ.displayName;
    if(!this.email) {
      this.storageServ.get('_user').subscribe(
        (user: any) => {
          this.email = user.email;
          this.displayName = user.displayName;
        }
      );
    }
    
    this.userServ.getMe().subscribe(
      (res: any) => {
        if(res && res.ok) {
          const user = res._body;
          this.myPhotoUrl = user.myPhotoUrl;
        }
      }
    );
    let merchantId = this.merchantServ.id;
    if(!merchantId) {
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
    lang = (lang == 'en') ? 'sc' : 'en';
    this.translateServ.setDefaultLang(lang);
  }

  initMenuWithSystemAdmin(merchantId:string, isSystemAdmin:boolean) {
    if (isSystemAdmin) {
      this.menuItems = [
        {
          title: 'Dashboard',
          link: 'dashboard'
        },
        {
          title: 'Brands',
          link: 'brands'
        },        
        {
          title: 'Banners',
          link: 'banners'
        },
        {
          title: 'categories',
          link: 'categories'
        },
        {
          title: 'Collections',
          link: 'collections'
        },
        {
          title: 'Users',
          link: 'users'
        },
        {
          title: 'Orders',
          link: 'orders'
        },        
        {
          title: 'Upload',
          link: 'upload'
        }
      ];
    } else
      if (merchantId) {
        this.menuItems = [
          {
            title: 'Dashboard',
            link: 'dashboard'
          },
          {
            title: 'Banners',
            link: 'banners'
          },
          {
            title: 'Brands',
            link: 'brands'
          },            
          {
            title: 'Categories',
            link: 'categories'
          },
          {
            title: 'Collections',
            link: 'collections'
          },
          {
            title: 'Products',
            link: 'products'
          },
          {
            title: 'Orders',
            link: 'orders'
          },           
          {
            title: 'Merchant information',
            link: 'merchant-info'
          }
        ];
      } else {
        this.menuItems = [
          {
            title: 'Dashboard',
            link: 'dashboard'
          },
          {
            title: 'Address',
            link: 'address'
          },
          {
            title: 'Orders',
            link: 'orders'
          },
          {
            title: 'My cart',
            link: 'cart'
          },
          {
            title: 'My favorite',
            link: 'favorite'
          }, 
          {
            title: 'My products',
            link: 'my-products'
          }, 
          {
            title: 'My comments',
            link: 'my-comments'
          }                    
        ];
      }
  }

  initMenu(merchantId: string) {

    if(this.userServ.isSystemAdmin) {
      this.initMenuWithSystemAdmin(merchantId, this.userServ.isSystemAdmin);
    } else {
      this.storageServ.get('_isSystemAdmin').subscribe(
        (ret:boolean) => {
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
