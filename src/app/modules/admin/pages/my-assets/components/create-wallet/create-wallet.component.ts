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
   constructor(
     private walletServ: WalletService,
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {
      let words = this.walletServ.generateMnemonic();
      words = 'dune stem onion cliff equip seek kiwi salute area elegant atom injury';
      const wallet = this.walletServ.generateWallet(words);
      console.log('wallet==', wallet);
    }

}