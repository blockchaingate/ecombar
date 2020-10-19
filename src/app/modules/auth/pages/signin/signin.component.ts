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
  password: string;
  showDetail = false;
  rawErrMsg = '';
  errMsg = '';

  constructor(private router: Router, private appServ: AppService, private authServ: AuthService,
              private storage: StorageService,private userServ: UserService, private merchantServ: MerchantService) { }

  ngOnInit(): void { }

  signin(): void {
    const user: User = {};
    this.userServ.signin(this.email, this.password).subscribe(
      (res: any) => {
        if (res && res.token) {
          user._id = res.id;
          user.displayName = res.displayName;
          user.email = res.email;
          user.token = res.token;
          this.userServ.token = res.token;
          this.merchantServ.name = res.defaultMerchant.name;
          const decoded = this.authServ.decodeToken(res.token);
          this.userServ.tokenExp = decoded.exp;
          this.merchantServ.id = decoded.merchantId || res.defaultMerchant._id;
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

  signup(): void {
    this.router.navigate(['/auth/signup']);
  }

  togoleDetail(): void {
    this.showDetail = !this.showDetail;
  }
}
