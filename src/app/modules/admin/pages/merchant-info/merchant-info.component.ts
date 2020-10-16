import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-merchant-info',
  providers: [],
  templateUrl: './merchant-info.component.html',
  styleUrls: ['./merchant-info.component.scss', '../../../../../table.scss', '../../../../../button.scss']
})
export class MerchantInfoComponent implements OnInit{
    name: string;
    walletExgAddress: string;

    constructor(
      private userServ: UserService,
      private authServ: AuthService,
      private router: Router) {
    }

    ngOnInit() {
        this.userServ.getMe().subscribe(
            (res: any) => {
                console.log('res==', res);
                if(res && res.ok) {
                    const merchant = res._body.defaultMerchant;
                    if(merchant) {
                        this.name = merchant.name;
                        this.walletExgAddress = merchant.walletExgAddress;
                    }
                }
            }
        );
    }
    
    update() {
        const item = {
            name: this.name,
            walletExgAddress: this.walletExgAddress
        };
        this.userServ.updateSelfMerchant(item).subscribe(
            (res: any) => {
                if(res && res.ok) {
                    const body = res._body;
                }
            }
        );
    }
}