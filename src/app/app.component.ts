import { Component, OnInit, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/modules/shared/services/app.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { environment } from '../environments/environment';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { Router,ActivatedRoute,ParamMap } from '@angular/router';
import { StoreService } from 'src/app/modules/shared/services/store.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { ThemeService } from './services/theme.service';
import { themeEvn } from 'src/environments/themeEnv';
import { WalletService } from './modules/shared/services/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Madearn';
  themeList = themeEvn.themeList;
  themeSwitch = themeEvn.themeSwitch;

  constructor(
    private theme: ThemeService,
    private appServ: AppService, 
    private localSt: LocalStorage,
    private router: Router,
    private storageServ: StorageService, 
    private dataServ: DataService,
    private storeServ: StoreService,
    private walletServ: WalletService,
    private route: ActivatedRoute,
    private kanbanServ: KanbanService,
    private utilServ: UtilService,
    private translate: TranslateService) {
    appServ.id = environment.appid;
    // this.setLan();
  }

  ngOnInit() {

    this.localSt.getItem('ecomwallets').subscribe(
      (wallets: any) => {
        console.log('wallets===', wallets);
        if(!wallets || !wallets.items || (wallets.items.length == 0)) {
          //this.router.navigate(['/wallet']);
          return false;
        }
        this.walletServ.refreshWallets(wallets);
              
      }
    );

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
