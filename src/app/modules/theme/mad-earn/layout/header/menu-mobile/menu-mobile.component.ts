import { Component, OnInit } from '@angular/core';
import Config from 'src/app/config/config.json';

@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.css']
})
export class MenuMobileComponent implements OnInit {
  cryptoEnabled = Config['Enable-Crypto'];
  
  constructor() { }

  ngOnInit() {
  }

}
