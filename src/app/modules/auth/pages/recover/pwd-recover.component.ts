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
  selector: 'app-pwd-recover',
  templateUrl: './pwd-recover.component.html',
  styleUrls: ['./pwd-recover.component.scss', '../../../../../button.scss']
})
export class PwdRecoverComponent implements OnInit {
  email: string;
  password: string;
  showDetail = false;
  rawErrMsg = '';
  errMsg = '';

  constructor(private router: Router, private appServ: AppService, private authServ: AuthService,
              private storage: StorageService,private userServ: UserService, private merchantServ: MerchantService) { }

  ngOnInit(): void { }

  recover(): void {
    this.userServ.find({email: this.email}).subscribe(
      (res: any) => {
      },
      error => { this.rawErrMsg = error.message; this.errMsg = 'Invalid email or password'; }
    );
  }

  togoleDetail(): void {
    this.showDetail = !this.showDetail;
  }
}
