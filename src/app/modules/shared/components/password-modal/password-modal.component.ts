import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';
import { CoinService } from '../../services/coin.service';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss']
})
export class PasswordModalComponent implements OnInit{
    public onClose: Subject<Buffer>;
    public onCloseFabPrivateKey: Subject<any>;
    pwdHash: string;
    encryptedSeed: any;
    password: string;
    fabPrivateKey: any;
    seed: Buffer;

    constructor(
        private bsModalRef: BsModalRef,
        private toastr:ToastrService,
        private coinServ: CoinService,
        private translateServ: TranslateService,
        public utilServ: UtilService) {
            
    }  

    ngOnInit() {
        this.onClose = new Subject();
        this.onCloseFabPrivateKey = new Subject();
    }

    confirmPassword() {
        const pinHash = this.utilServ.SHA256(this.password).toString();
        if (pinHash !== this.pwdHash) {
            this.warnPwdErr();
            return;
        }
        const seed = this.utilServ.aesDecryptSeed(this.encryptedSeed, this.password);
        const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        const privateKey = keyPair.privateKeyBuffer.privateKey;
        this.onCloseFabPrivateKey.next(privateKey);
        this.onClose.next(seed);
        this.bsModalRef.hide();
    }

    close() {
        this.bsModalRef.hide();
    }
    warnPwdErr() {
        this.toastr.error(this.translateServ.instant('Your password is invalid.'));
    }   
}
