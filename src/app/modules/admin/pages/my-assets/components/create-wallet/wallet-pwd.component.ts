import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, FormControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { WalletService } from '../../../../../shared/services/wallet.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
    selector: 'app-wallet-pwd',
    templateUrl: './wallet-pwd.component.html',
    styleUrls: ['./wallet-pwd.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class WalletPwdComponent implements OnInit {
    userForm: FormGroup;

    constructor(
        private route: Router, 
        private walletServ: WalletService, 
        private fb: FormBuilder, 
        private translate: TranslateService,
        private localSt: LocalStorage) {
    }

    ngOnInit() {
        this.userForm = this.fb.group({
            type: [null, [Validators.required]],
            name: [null, [
                Validators.required,
                Validators.pattern(/^[A-z0-9]*$/),
                Validators.minLength(2)]
            ],
            password: [null, [
                Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`!@#\(\)\$%\^&\*])(?=.{8,})/)]
            ],
            pwdconfirm: ['']
        }, { validator: this.checkPasswords });
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const pass = group.controls.password.value;
        const confirmPass = group.controls.pwdconfirm.value;

        return pass === confirmPass ? null : { notSame: true };
    }

    onSubmit() {
        
        const name = this.userForm.controls.name.value;
        const pwd = this.userForm.controls.password.value;

        // const mnemonic = sessionStorage.mnemonic.trim().replace(/\s\s+/g, ' ');
        let mnemonic = sessionStorage.mnemonic;
        mnemonic = mnemonic.trim().replace(/\s\s+/g, ' ').replace(/(\r\n|\n|\r)/gm, '');
        const wallet = this.walletServ.generateWallet(pwd, name, mnemonic);

        sessionStorage.removeItem('mnemonic');

        if (!wallet) {
            alert(this.translate.instant('Error occured, please try again.'));
        } else {

            this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {
                if (!wallets) {
                    wallets = {
                        currentIndex: -1,
                        items: []
                    };
                }
                if (wallets.items.indexOf(wallet) < 0) {
                    wallets.items.push(wallet);
                    wallets.currentIndex ++;
                }
                this.localSt.setItem('ecomwallets', wallets).subscribe(() => {
                    this.route.navigate(['/admin/wallet-dashboard']);
                });
            });
            
        }

    }
}
