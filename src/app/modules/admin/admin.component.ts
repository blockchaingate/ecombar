import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { MerchantService } from '../shared/services/merchant.service';
import { StorageService } from '../shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../store/states/user.state';
import { logout, updateMerchantStatus } from '../../store/actions/user.actions';

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
    private store: Store<{ user: UserState }>,
    private router: Router, 
    private translateServ: TranslateService, 
    private merchantServ: MerchantService,
    private userServ: UserService, 
    private storageServ: StorageService
  ) { }

  async ngOnInit() {
    this.year = (new Date()).getFullYear();

    //this.userState$ = this.store.select('user');
    console.log('ngiiiit');
    this.store.select('user').subscribe((user: UserState) => {
      this.role = user.role;
      console.log('this.role=', this.role);
      this.myPhotoUrl = user.myPhotoUrl;
      this.displayName = user.displayName;
      this.merchantId = user.merchantId;
      this.merchantStatus = user.merchantStatus;
  
      console.log('this.merchantStatus=', this.merchantStatus);
      if(this.merchantId && this.merchantStatus == 'pending') {
        this.merchantServ.getMerchant(this.merchantId).subscribe(
          (res: any) => {
            console.log('res in gerMerchant=', res);
            if(res.approved) {
              this.merchantStatus = 'approved';
              this.store.dispatch(updateMerchantStatus({newStatus: this.merchantStatus}));
            }
          }
        );
      }
    })





    this.menuItems = [
      {
        title: 'Dashboard',
        link: 'dashboard',
        icon: 'dashboard',
        roles: ['Admin', 'Seller', 'Customer']
      },      
      {
        title: 'Categories',
        link: 'categories',
        icon: 'category',
        roles: ['Admin', 'Seller']
      },
      {
        title: 'Collections',
        link: 'collections',
        icon: 'collection',
        roles: ['Admin', 'Seller']
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
        title: 'Products',
        link: 'products',
        icon: 'order',
        roles: ['Seller']
      },           
      {
        title: 'Orders',
        link: 'orders',
        icon: 'order',
        roles: ['Admin', 'Seller', 'Customer']
      },    
      {
        title: 'Merchant information',
        link: 'merchant-info',
        icon: 'information',
        roles: ['Seller']
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
    this.store.dispatch(logout());
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
