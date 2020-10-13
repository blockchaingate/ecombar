import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  providers: [UserService],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss', '../../../../../button.scss']
})
export class SigninComponent implements OnInit{
  email: string;
  password: string;
  token: string;

  constructor(private router: Router, private userServ: UserService) {
    
    
  }
  ngOnInit() {
    const token = this.userServ.getToken();
    console.log('token=', token);
  }

  signin() {
    this.userServ.signin(this.email, this.password).subscribe(
      (res: any) => {
        if(res && res.token) {
          this.token = res.token;
          this.userServ.saveToken(this.token).subscribe((res: any) => {
            this.router.navigate(['/admin']);
          });
          
        }
      }
    );
  }

  signup() {
    this.router.navigate(['/auth/signup']);
  }
}
