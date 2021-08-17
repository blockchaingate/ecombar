import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WalletService } from 'src/app/modules/shared/services/wallet.service';

@Component({
  selector: 'app-admin-create-wallet',
  providers: [],
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent implements OnInit{
  mnemonics: any;
   constructor(
     private walletServ: WalletService,
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {
      let words = this.walletServ.generateMnemonic();
      sessionStorage.mnemonic = words;
      this.mnemonics = words.split(' ');
    }

}