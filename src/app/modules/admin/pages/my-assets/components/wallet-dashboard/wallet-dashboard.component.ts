import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-admin-wallet-dashboard',
  providers: [],
  templateUrl: './wallet-dashboard.component.html',
  styleUrls: ['./wallet-dashboard.component.scss']
})
export class WalletDashboardComponent implements OnInit{
   constructor(
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {


    }

}