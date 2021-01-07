import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../shared/services/translate.service';
import { User } from '../../../shared/models/user';
import { MerchantService } from '../../../shared/services/merchant.service';
import { AppService } from '../../../shared/services/app.service';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { UserService } from '../../../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss', '../../../../../button.scss']
})
export class ActivationComponent implements OnInit {
  email: string;
  userId: string;
  vericode: string;
  password: string;
  showDetail = false;
  rawErrMsg = '';
  errMsg = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private appServ: AppService, private authServ: AuthService,
    private storage: StorageService, private userServ: UserService, private merchantServ: MerchantService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.email = params['email'];
      this.userId = params['userId'] || params['memberId'];
      this.vericode =  params['verfycode'];
    })
  }

  confirm(): void {
    if (!this.email || this.email.length < 8 || !this.vericode || this.vericode.length < 16) {
      this.errMsg = 'Invalid email or verification code';
      this.rawErrMsg = '';
      return;
    }

    this.userServ.find({email: this.email}).subscribe(
      (res: any) => {
        this.userId = res.memberId || res.userId;
        this.activate(this.userId, this.vericode);
      },
      err => {
        this.rawErrMsg = err.message; this.errMsg = "Invalid email or verification code";
      }
    );
  }

  activate(userId: string, veriCode: string) {
    this.userServ.activateUser(userId, veriCode).subscribe(
      (res: any) => {
        this.router.navigate(['/auth/signin']);
      },
      error => { this.rawErrMsg = error.message; this.errMsg = 'Invalid email or verification code'; }
    );
  }

  togoleDetail(): void {
    this.showDetail = !this.showDetail;
  }
}
