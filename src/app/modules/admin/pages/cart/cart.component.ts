import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { AuthService } from 'src/app/modules/shared/services/auth.service';

@Component({
  selector: 'app-admin-cart',
  providers: [],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
    currentTab: string;

    constructor(
      private userServ: UserService,
      private authServ: AuthService,
      private router: Router) {
    }

    ngOnInit() {
        this.currentTab = 'default';
    }

    changeTab(tabName: string) {
        this.currentTab = tabName;
    }

    update() {
    }
}
