import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../shared/services/translate.service';
import { User } from '../../../shared/models/user';
import { MerchantService } from '../../../shared/services/merchant.service';
import { AppService } from '../../../shared/services/app.service';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss', '../../../../../button.scss']
})
export class SigninComponent implements OnInit {
  email: string;
  emailSignup: string;
  passwordSignup: string;
  repasswordSignup: string;
  password: string;
  showDetail = false;
  rawErrMsg = '';
  errMsg = '';
  errMsgSignup = '';
  regexpEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  // const regexpPwd = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);

  constructor(private router: Router, private appServ: AppService, private authServ: AuthService,
              private storage: StorageService,private userServ: UserService, private merchantServ: MerchantService) { }

  ngOnInit(): void { }

  signin(): void {
    if(!this.regexpEmail.test(this.email) || !this.password || this.password.length < 6){
      this.errMsg = 'Invalid email or password';
      return;
    }

    const user: User = {};
    this.userServ.signin(this.email, this.password).subscribe(
      (res: any) => {
        if (res && res.token) {
          user._id = res.id;
          user.displayName = res.displayName;
          user.email = res.email;
          user.token = res.token;
          this.userServ.token = res.token;
          const decoded = this.authServ.decodeToken(res.token);
          if(res.defaultMerchant) {
            this.merchantServ.name = res.defaultMerchant.name;
            this.merchantServ.id = decoded.merchantId || res.defaultMerchant._id;
          }
          
          this.userServ.tokenExp = decoded.exp;
          
          this.appServ.id = res.appId || decoded.appId;
          this.appServ.name = res.appName || decoded.appName;
          let isSysAdmin = false;
          if (decoded.aud === 'isSystemAdmin') {
            isSysAdmin = true;
          }
          this.userServ.isSystemAdmin = isSysAdmin;
          // const current = Math.floor(Date.now() / 1000);
          this.storage.user = user;
          this.router.navigate(['/admin']);
        }
      },
      error => { this.rawErrMsg = error.message; this.errMsg = 'Invalid email or password'; }
    );
  }

  signup() {
    console.log('go signuppp');
    const regexpEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const regexpPwd = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);

    /*
  if(!regexpEmail.test(this.emailSignup) || !regexpPwd.test(this.passwordSignup) || this.passwordSignup !== this.repasswordSignup){
      this.errMsg = 'Invalid email or password';
      console.log('Invalid email or password');
      return;
    }
    */
    this.userServ.signup(this.emailSignup, this.passwordSignup).subscribe(
      (res: any) => {
        if (res && res.token) {
        } else {
          this.errMsg = 'Invalid email or password';
        }
      },
      err => { this.rawErrMsg = err.message; this.errMsg = 'Invalid email or password';}
    );
  }

  togoleDetail(): void {
    this.showDetail = !this.showDetail;
  }
}
