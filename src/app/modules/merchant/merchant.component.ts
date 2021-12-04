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
  providers: [UserService],
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {
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
    private localSt: LocalStorage,
    private storeServ: StoreService, 
    private dataServ: DataService,
    private storageServ: StorageService
  ) { }

  async ngOnInit() {
    this.year = (new Date()).getFullYear();

    //this.userState$ = this.store.select('user');

    this.localSt.getItem('ecomwallets').subscribe(
      (wallets: any) => {
        console.log('wallets===', wallets);
        if(!wallets || !wallets.items || (wallets.items.length == 0)) {
          this.router.navigate(['/wallet']);
          return false;
        }

        const wallet = wallets.items[wallets.currentIndex];
        console.log('wallet=', wallet);
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
                this.dataServ.changeStore(store);
              }
            });

        } else {
          this.router.navigate(['/wallet']);
        }
              
      }
    );
    /*
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
    */




    this.menuItems = [
      {
        title: 'Dashboard',
        link: 'dashboard',
        icon: 'dashboard'
      },
      {
        title: 'Store',
        link: 'store',
        icon: 'store'
      },  
      {
        title: 'Products',
        link: 'products',
        icon: 'product'
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
        title: 'Main Layout',
        link: 'main-layout',
        icon: 'category'
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
        title: 'Merchant Applications',
        link: 'merchant-applications',
        icon: 'user'
      },  
      {
        title: 'Products',
        link: 'products',
        icon: 'order'
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
      },      
      {
        title: 'Merchant information',
        link: 'merchant-info',
        icon: 'information'
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
