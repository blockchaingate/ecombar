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

  constructor(private appServ: AppService, private storageServ: StorageService, private translateService: TranslateService) {
    appServ.id = environment.appid;
  }

  ngOnInit() {
    const lan = this.storageServ.lang;
    if (lan) {
      this.translateService.setDefaultLang(lan);
    }
  }
}
