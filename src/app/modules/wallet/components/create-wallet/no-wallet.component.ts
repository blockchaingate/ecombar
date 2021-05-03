import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-no-wallet',
    templateUrl: './no-wallet.component.html',
    styleUrls: ['./no-wallet.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NoWalletComponent implements OnInit{
    title = 'Wallet';

    networkLoaded: boolean;
    translationLoaded: boolean;

    constructor(private route: Router) {
    }

    ngOnInit() {
      
    }
    // Create Wallet
    createWallet() {
      this.route.navigate(['/wallet/create-wallet']);
    }

    restoreWallet() {
      this.route.navigate(['/wallet/import-wallet']);
    }
}
