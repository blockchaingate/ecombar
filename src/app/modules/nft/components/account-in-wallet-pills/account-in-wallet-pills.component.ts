import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-nft-account-in-wallet-pills',
    templateUrl: './account-in-wallet-pills.component.html',
    styleUrls: ['./account-in-wallet-pills.component.scss']
  })
  export class NftAccountInWalletPillsComponent implements OnInit {
    @Input() selectedCollections: any;
    @Input() selectedCurrencies: any;      
    ngOnInit() {

    }

    removeCollection(index) {
        this.selectedCollections.splice(index, 1);
    }

    removeCurrency(index) {
        this.selectedCurrencies.splice(index, 1);
    }
  }