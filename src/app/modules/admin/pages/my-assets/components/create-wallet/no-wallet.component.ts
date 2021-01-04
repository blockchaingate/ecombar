import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {TranslateService} from '@ngx-translate/core';

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
      this.route.navigate(['/admin/create-wallet']);
    }

    restoreWallet() {
      this.route.navigate(['/admin/import-wallet']);
    }
}
