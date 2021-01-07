import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../../../../../button.scss']
})
export class SignupComponent implements OnInit {
  email: string;
  password: string;
  repassword: string;
  token: string;
  showDetail = false;
  errMsg = '';
  rawErrMsg = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userServ: UserService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.email = params['email'];
      })
  }

  signup() {
    const regexpEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const regexpPwd = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);

  if(!regexpEmail.test(this.email) || !regexpPwd.test(this.password) || this.password !== this.repassword){
      this.errMsg = 'Invalid email or password';
      return;
    }

    this.userServ.signup(this.email, this.password).subscribe(
      (res: any) => {
        if (res && res.token) {
        } else {
          this.errMsg = 'Invalid email or password';
        }
      },
      err => { this.rawErrMsg = err.message; this.errMsg = 'Invalid email or password';}
    );
  }

  signin() {
    this.router.navigate(['/auth/signin']);
  }

  togoleDetail(): void {
    this.showDetail = !this.showDetail;
  }
}
