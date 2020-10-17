import { Component } from '@angular/core';
import { AppService } from './modules/shared/services/app.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecombar';

  constructor(private appServ: AppService) {
    appServ.id = environment.appid;
  }
}
