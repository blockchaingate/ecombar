import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Merchant } from '../../../../models/merchant';
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { UserState } from '../../../../store/states/user.state';
import { Store } from '@ngrx/store';
import { selectMerchantId, selectEmail } from '../../../../store/selectors/user.selector';
import { TranslateService } from '@ngx-translate/core';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { updateMerchantStatus } from '../../../../store/actions/user.actions';

@Component({
  selector: 'app-apply-for-merchant',
  templateUrl: './apply-for-merchant.component.html',
  styleUrls: ['./apply-for-merchant.component.scss']
})
export class ApplyForMerchantComponent implements OnInit {

    //user: User;
    token: string;
    errMsg: string;
    merchant: Merchant = new Merchant('', '');
    submited = false;
    msg = 'You applied merchant account already.';
    lan = 'en';

    merchantForm = new FormGroup({
        merchantType: new FormControl(''),
        merchantName: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
    });

    constructor(
        private store: Store<{ user: UserState }>,
        private merchantServ: MerchantService,
        private translateServ: TranslateService,
        private _mcServ: MerchantService) { }    

    ngOnInit() {
        const merchantIdSelect = this.store.select(selectMerchantId);
        merchantIdSelect.subscribe(merchantId => {
            if(merchantId) {
                this.merchantServ.getMerchant(merchantId).subscribe((res: any) => {

                })
                this.msg = this.translateServ
                .instant('Your merchant account is under review currently, please check later.');
            }
        });

        const emailSelect = this.store.select(selectEmail);
        emailSelect.subscribe(
            res =>  {
                this.merchantForm.patchValue({'email': res});
            }
        );

    }

    onSubmit() {
        const merchantType = this.merchantForm.get('merchantType').value;
        const merchantName = this.merchantForm.get('merchantName').value;
        const email = this.merchantForm.get('email').value;
        const phone = this.merchantForm.get('phone').value;

        if(!merchantType) {
            this.errMsg = this.translateServ
            .instant('Please select merchant type');            
            return;
        }

        if(!merchantName) {
            this.errMsg = this.translateServ
            .instant('Please provide merchant name');            
            return;
        }

        if(!email) {
            this.errMsg = this.translateServ
            .instant('Please provide email');            
            return;
        }

        if(!phone) {
            this.errMsg = this.translateServ
            .instant('Please provide phone');            
            return;
        }    

      const merchant = {
          name: merchantName,
          phone: phone,
          email: email,
          type: merchantType
      };

      this._mcServ.create(merchant).subscribe(
          res => {  // this._router.navigate(['/otc/otc-merchant/waitting']);
              this.submited = true;
              this.store.dispatch(updateMerchantStatus({newStatus:'pending'}) )
              this.msg = this.translateServ.instant('You have submited application successful, please waiting for review, it may take 3~5 business days.');

          },
          err => { this.errMsg = err.message || err; }
      );
  }    
}