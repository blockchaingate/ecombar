import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-admin-create-wallet',
  providers: [],
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent implements OnInit{
   constructor(
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {


    }

}