import { Component, OnInit } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
  })
  export class NftHeaderComponent implements OnInit {
    showAside: boolean;
    ngOnInit() {
        this.showAside = false;    
    }
  }
