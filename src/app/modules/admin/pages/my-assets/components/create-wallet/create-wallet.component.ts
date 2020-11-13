import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WalletService } from '../../../../../shared/services/wallet.service';

@Component({
  selector: 'app-admin-create-wallet',
  providers: [],
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent implements OnInit{
  mnemonics: any;
   constructor(
      private route: ActivatedRoute,
      private walletServ: WalletService,
      private router: Router) {
    }

    ngOnInit() {
      const mnemonics = this.walletServ.generateMnemonic();
      this.mnemonics = mnemonics.split(' ');
    }

}