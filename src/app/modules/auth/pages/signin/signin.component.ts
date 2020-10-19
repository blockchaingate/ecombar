import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user';
import { MerchantService } from '../../../shared/services/merchant.service';
import { AppService } from '../../../shared/services/app.service';
import { AuthService } from '../../../shared/services/auth.service';
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

  constructor(private router: Router, private appServ: AppService, private authServ: AuthService, private userServ: UserService, private merchantServ: MerchantService) { }

  ngOnInit() { }

  signin() {
    this.userServ.signin(this.email, this.password).subscribe(
      (res: any) => {
        if (res && res.token) {
          alert('token: ' + JSON.stringify(res));
          this.userServ.id = res.id;
          this.userServ.displayName = res.displayName;
          this.userServ.email = res.email;
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
          this.router.navigate(['/admin']);
        }
      }
    );
  }

  signup() {
    this.router.navigate(['/auth/signup']);
  }
}
