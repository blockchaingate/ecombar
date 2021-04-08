import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-account-in-wallet',
    templateUrl: './account-in-wallet.component.html',
    styleUrls: ['./account-in-wallet.component.scss']
  })
  export class NftAccountInWalletComponent implements OnInit {
    options = {
        expanded: true
    }

    optionsNoBorderTop = {
        expanded: true,
        noBorderTop: true
    };
    
    ngOnInit() {
          
    }

  }
