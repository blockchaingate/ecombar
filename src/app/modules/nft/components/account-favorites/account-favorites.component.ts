import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-account-favorites',
    templateUrl: './account-favorites.component.html',
    styleUrls: ['./account-favorites.component.scss']
  })
  export class NftAccountFavoritesComponent implements OnInit {

    options = {
        expanded: true
    }    
    ngOnInit() {

    }
  }