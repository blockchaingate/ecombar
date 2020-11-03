import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-comment',
  providers: [],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss', '../../../../../table.scss', '../../../../../button.scss']
})
export class CommentComponent implements OnInit{
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