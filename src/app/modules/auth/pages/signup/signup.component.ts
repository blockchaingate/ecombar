import { Component } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../../../../../button.scss']
})
export class SignupComponent {
  email: string;
  password: string;
  repassword: string;
  token: string;

  constructor(private router: Router, private userServ: UserService) {
    
  }

  signup() {
    this.userServ.signup(this.email, this.password).subscribe(
      (res: any) => {
        if(res && res.token) {
          
          
        }
      }
    );
  }

  signin() {
    this.router.navigate(['/auth/signin']);
  }
}
