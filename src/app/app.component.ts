import { Component, OnInit, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from './modules/shared/services/app.service';
import { StorageService } from './modules/shared/services/storage.service';
import { environment } from '../environments/environment';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ThemeService } from './services/theme.service';
import { themeEvn } from 'src/environments/themeEnv';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ecombar';
  themeList = themeEvn.themeList;

  constructor(
    private theme: ThemeService,
    private appServ: AppService, 
    private localSt: LocalStorage,
    private storageServ: StorageService, 
    private translate: TranslateService) {
    appServ.id = environment.appid;
    // this.setLan();
  }

  ngOnInit() {

    /*
    .pipe(
      take(1),
      map((wallets: any) => {
        console.log('wallets==', wallets);
        if(!wallets || !wallets.items || (wallets.items.length == 0)) {
          this.router.navigate(['/wallet']);
          return false;
        }

        const wallet = wallets.items[wallets.currentIndex];

        const addresses = wallet.addresses;
        const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
        const walletAddress = walletAddressItem.address;
        this.dataServ.changeWalletAddress(walletAddress);
        return true;
      })
    );
    */
  }

  setLan() {
    let lang = this.storageServ.lang;

    if (!lang) {
      lang = navigator.language;
      lang = lang.substr(0, 2).toLowerCase();
      if (lang === 'cn' || lang === 'zh') {
        lang = 'sc';
      }
    }

    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.storageServ.lang = lang;
  }

  changeTheme(theme: string){
    // console.log("change theme: " + theme);
    
    this.theme.changeMessage(theme);
  }
  

}
