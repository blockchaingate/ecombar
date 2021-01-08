import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss']
})
export class PasswordModalComponent {
    @Output() onConfirmPassword = new EventEmitter<string>();
    @Input() pwdHash: string;

    password: string;

    constructor(
        private toastr:ToastrService,
        private translateServ: TranslateService,
        public utilServ: UtilService) {
    }  

    confirmPassword() {
        const pinHash = this.utilServ.SHA256(this.password).toString();
        if (pinHash !== this.pwdHash) {
            this.warnPwdErr();
            return;
        }
        console.log('this.password in here=', this.password);
        this.onConfirmPassword.emit(this.password);
    }

    warnPwdErr() {
        this.toastr.error(this.translateServ.instant('Your password is invalid.'));
    }   
}
