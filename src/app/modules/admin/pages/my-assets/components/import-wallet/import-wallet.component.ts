import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-admin-import-wallet',
  providers: [],
  templateUrl: './import-wallet.component.html',
  styleUrls: ['./import-wallet.component.scss']
})
export class ImportWalletComponent implements OnInit{
   constructor(
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {


    }

}