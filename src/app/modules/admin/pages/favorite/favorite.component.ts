import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-favorite',
  providers: [],
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss', '../../../../../table.scss', '../../../../../button.scss']
})
export class FavoriteComponent implements OnInit{
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