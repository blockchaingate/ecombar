import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import Config from '../../../../../../config/config.json';

@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.css']
})
export class MenuMobileComponent implements OnInit {
  storeId: string;
  cryptoEnabled = Config['Enable-Crypto'];
  
  constructor(private dataServ: DataService) { }

  ngOnInit() {
    this.dataServ.currentStoreId.subscribe(
      (storeId: string) => {
        this.storeId = storeId;
      }
    );
  }

}
