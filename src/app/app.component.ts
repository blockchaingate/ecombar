import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from './modules/shared/services/app.service';
import { StorageService } from './modules/shared/services/storage.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ecombar';

  constructor(private appServ: AppService, private storageServ: StorageService, private translate: TranslateService) {
    appServ.id = environment.appid;
    // this.setLan();
  }

  ngOnInit() {
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

}
