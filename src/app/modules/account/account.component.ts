
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../store/states/user.state';
import { logout, updateMerchantStatus } from '../../store/actions/user.actions';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { StoreService } from 'src/app/modules/shared/services/store.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  providers: [UserService],
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  year = 2022;
  showNavMenu = false;
  dropDownActive = false;
  //displayName: string;
  merchantId: string;
  wallets: any;
  wallet: any;
  /*
  myPhotoUrlSelect: Observable<string>;
  displayNameSelect: Observable<string>;
  roleSelect: Observable<string>;
  */
  extendedMenu: string;

  role: string;
  myPhotoUrl: string;
  displayName: string;
  merchantStatus: string;

  menuItems: any;

  constructor(
    private store: Store<{ user: UserState }>,
    private router: Router, 
    private translateServ: TranslateService, 
    private dataServ: DataService,
    private storeServ: StoreService,
    private storageServ: StorageService,
    private localSt: LocalStorage
  ) { }

  async ngOnInit() {
    this.year = (new Date()).getFullYear();

    // this.userState$ = this.store.select('user');
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
        link: '/account/dashboard',
        icon: 'tv-outline',
        // line: 1,  // 下边线支持
      },     
      {
        title: 'Orders',
        link: '/account/orders',
        icon: 'clipboard-outline'
      },
      // ---------- ---------- 删除多余菜单 ---------- ----------
      // {
      //   title: 'Ships',
      //   link: 'ships',
      //   icon: 'order'
      // },
      // {
      //   title: 'Address',
      //   link: 'address',
      //   icon: 'address',
      //   roles: ['Customer']
      // },

      // {
      //   title: 'My cart',
      //   link: 'cart',
      //   icon: 'cart',
      //   roles: ['Customer']
      // },
      // {
      //   title: 'My favorite',
      //   link: 'favorite',
      //   icon: 'favorite',
      //   roles: ['Customer']
      // },
      // {
      //   title: 'My products',
      //   link: 'my-products',
      //   icon: 'product',
      //   roles: ['Customer']
      // },
      // {
      //   title: 'My comments',
      //   link: 'my-comments',
      //   icon: 'comment',
      //   roles: ['Customer'] 
      // }      
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
        (lang2: any) => {
          if (lang2) {
            this.translateServ.setDefaultLang(lang2);
          }

        }
      );
    } else {
      this.translateServ.setDefaultLang(lang);
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
      this.dataServ.changeWalletAddress(walletAddress); 

      this.storeServ.getStoresByAddress(walletAddress).subscribe(
        (ret: any) => {
          console.log('ret in account=', ret);
          if(ret && ret.length > 0) {
            const store = ret[0];
            this.dataServ.changeMyStore(store);
          }
        });

    }
  }

    // 导航方法
    navigateTo( link: string ) {
        this.router.navigate([link]);
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

  toggle(menu: string) {

  }

}
