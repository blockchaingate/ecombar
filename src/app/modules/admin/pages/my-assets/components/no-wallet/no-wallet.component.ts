import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-admin-no-wallet',
  providers: [],
  templateUrl: './no-wallet.component.html',
  styleUrls: ['./no-wallet.component.scss']
})
export class NoWalletComponent implements OnInit{
   constructor(
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {


    }

}