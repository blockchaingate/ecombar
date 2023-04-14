
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { StoreService } from 'src/app/modules/shared/services/store.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  providers: [],
  selector: 'app-chef',
  templateUrl: './chef.component.html',
  styleUrls: ['./chef.component.scss']
})
export class ChefComponent implements OnInit {
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
