import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import {ActivatedRoute, Router, ParamMap} from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Merchant } from '../../../models/merchant';
import { MerchantService } from '../../shared/services/merchant.service';
import { StorageService } from '../../shared/services/storage.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-apply-for-merchant',
  templateUrl: './apply-for-merchant.component.html',
  styleUrls: ['./apply-for-merchant.component.scss']
})
export class ApplyForMerchantComponent implements OnInit {

    //user: User;
    token: string;
    merchant: Merchant = new Merchant('', '');
    submited = false;
    msg = 'You applied merchant account already.';
    errMsg: string;
    lan = 'en';

    merchantForm = new FormGroup({
        merchantName: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
    });

    constructor(
        private storageService: StorageService,
        private _router: Router,
        private _userServ: UserService,
        private _mcServ: MerchantService) { }    

    ngOnInit() {
        this.lan = localStorage.getItem('Lan');

                this._userServ.getMe().subscribe(
                    (res: any) => {
                        console.log('res for getMe=', res);
                        if (res && res.ok) {
                            const body = res._body;
                            const defaultMerchant = body.defaultMerchant;
                            if (!defaultMerchant) {
                                return;
                            }
                            this.submited = true;
                            if (defaultMerchant.otcApproved) {
                                // this._router.navigate(['/otc/otc-merchant']);
                            } else {
                                if (this.lan === 'zh') {
                                    this.msg = '您的商户申请正在审核，请耐心等候。';
                                } else {
                                    this.msg = 'Your merchant account is under review currently, please check later.';
                                }
                            }
                        } else {
                            // this._router.navigate(['/login/signin', { retUrl: '/otc/otc-merchant/merchant-application' }]);
                        }
                    },
                    (error) => {
                        console.log('error there we go', error);
                    }
                );
    }

    onSubmit() {

      const merchant = {
          name: this.merchantForm.get('merchantName').value,
          phone: this.merchantForm.get('phone').value,
          email: this.merchantForm.get('email').value
      };

      this._mcServ.create(merchant).subscribe(
          res => {  // this._router.navigate(['/otc/otc-merchant/waitting']);
              this.submited = true;
              if (this.lan === 'zh') {
                  this.msg = '您的申请已经成功提交，需要3~5个工作日审核，请耐心等候。';
              } else {
                  this.msg = 'You have submited application successful, please waiting for review, it may take 3~5 business days.';
              }
          },
          err => { this.errMsg = err.message || err; }
      );
  }    
}