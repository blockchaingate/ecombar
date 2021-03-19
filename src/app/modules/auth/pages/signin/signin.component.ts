import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../shared/services/translate.service';
import { User } from '../../../shared/models/user';
import { MerchantService } from '../../../shared/services/merchant.service';
import { AppService } from '../../../shared/services/app.service';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { login } from '../../../../store/actions/user.actions';
import { UserState } from '../../../../store/states/user.state';
import { Role } from '../../../../config/role';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss', '../../../../../button.scss']
})
export class SigninComponent implements OnInit {
  count$: Observable<number>;
  email: string;
  emailSignup: string;
  passwordSignup: string;
  repasswordSignup: string;
  password: string;
  msgSignupSuccess: boolean;
  showDetail = false;
  rawErrMsg = '';
  errMsg = '';
  errMsgSignup = '';
  regexpEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  // const regexpPwd = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);

  constructor(
    private store: Store<{ userState: UserState }>,
    private router: Router, 
    private appServ: AppService, 
    private authServ: AuthService,
    private storage: StorageService,
    private userServ: UserService, 
    private merchantServ: MerchantService) { }

  ngOnInit(): void {
    //this.count$ = this.store.select('count');
  }


 /*
  increment() {
    this.store.dispatch(increment());
  }
 
  decrement() {
    this.store.dispatch(decrement());
  }
 
  reset() {
    this.store.dispatch(reset());
  }
*/

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

          let role = 'Customer';
          if (decoded.aud === 'isSystemAdmin') {
            role = 'Admin'
          }

          let merchantStatus = '';
          if(res.defaultMerchant && res.defaultMerchant._id) {
            console.log('res.defaultMerchant==', res.defaultMerchant);
            this.merchantServ.name = res.defaultMerchant.name;
            this.merchantServ.id = res.defaultMerchant._id;

            this.merchantServ.getMerchant(res.defaultMerchant._id).subscribe(
              (merchant: any) => {
                console.log('merchant in login=', merchant);
            
                if(merchant) {
                  const type = merchant.type;
                  if(type == 'seller') {
                    role = Role.Seller;
                  }else 
                  if(type == 'delivery') {
                    role = Role.Delivery;
                  }else
                  if(type == 'nftseller') {
                    role = Role.NFTSeller;
                  }
                  if(merchant.approved) {
                    merchantStatus = 'approved';
                  } else {
                    merchantStatus = 'pending';
                  }

                  const userState: UserState = {
                    email: user.email, 
                    displayName: user.displayName,
                    role: role, 
                    token: user.token, 
                    walletExgAddress: res.walletExgAddress,
                    myPhotoUrl: res.myPhotoUrl,
                    merchantId: res.defaultMerchant._id,
                    merchantStatus: merchantStatus
                  };
        
                  this.store.dispatch(login({userState}));
                  this.router.navigate(['/admin']);

                }
              }
            );
          } else {
            const userState: UserState = {
              email: user.email, 
              displayName: user.displayName,
              role: role, 
              token: user.token, 
              walletExgAddress: res.walletExgAddress,
              myPhotoUrl: res.myPhotoUrl,
              merchantId: '',
              merchantStatus: merchantStatus
            };
  
            this.store.dispatch(login({userState}));
            this.router.navigate(['/admin']);
          }


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
        console.log('res==', res);
        if (res && res.activationCode) {
          this.msgSignupSuccess = true;
          this.errMsgSignup = '';
        } else {
          this.errMsgSignup = 'Sign up error.';
        }
      },
      err => { 
        this.errMsgSignup = err.error.message;
      }
    );
  }

  togoleDetail(): void {
    this.showDetail = !this.showDetail;
  }
}
