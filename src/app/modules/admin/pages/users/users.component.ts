import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss', '../../../../../table.scss', '../../../../../button.scss']
})
export class UsersComponent implements OnInit{
  users: any;
  email: string;
  constructor(
    private router: Router,
    private userServ: UserService) {
  }  
  ngOnInit() {
    this.userServ.getAllUsers().subscribe(
      (res: any) => {
        console.log('res===', res);
        this.users = res;
      }
    );
  }

  edit(user) {
    this.router.navigate(['/admin/user/' + user._id + '/edit']);
  }

  find() {
    const body = {
      email: this.email
    }
    this.userServ.find(body).subscribe(
      (res:any) => {
        console.log('res===', res);
        this.users = res;
      }
    );
  }
}
