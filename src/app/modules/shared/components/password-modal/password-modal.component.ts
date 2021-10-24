import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from "rxjs";
import { CoinService } from '../../services/coin.service';
import { KanbanService } from '../../services/kanban.service';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss']
})
export class PasswordModalComponent implements OnInit{
    public onClose: Subject<Buffer>;
    public onClosePin: Subject<string>;
    public onCloseFabPrivateKey: Subject<any>;
    pwdHash: string;
    encryptedSeed: any;
    password: string;
    gas: number = 0.00001;
    fabPrivateKey: any;
    seed: Buffer;

    constructor(
        private bsModalRef: BsModalRef,
        private toastr:ToastrService,
        private coinServ: CoinService,
        private kanbanServ: KanbanService,
        private translateServ: TranslateService,
        public utilServ: UtilService) {
            
    }  

    ngOnInit() {
        this.onClose = new Subject();
        this.onClosePin = new Subject();
        this.onCloseFabPrivateKey = new Subject();
    }

    confirmPassword() {
        const pinHash = this.utilServ.SHA256(this.password).toString();
        if (pinHash != this.pwdHash) {
            this.warnPwdErr();
            return;
        }
        this.onClosePin.next(this.password);
        const seed = this.utilServ.aesDecryptSeed(this.encryptedSeed, this.password);
        const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        const address = keyPair.address;

        this.kanbanServ.getKanbanBalance(this.utilServ.fabToExgAddress(address)).subscribe(
            (resp: any) => {
                // console.log('resp=', resp);
                const fab = this.utilServ.stripHexPrefix(resp.balance.FAB);
                const gas = this.utilServ.hexToDec(fab) / 1e18;
                if(gas < this.gas) {
                    this.toastr.error('No gas to make this transaction.');
                    this.close();
                } else {
                    const privateKey = keyPair.privateKeyBuffer.privateKey;
                    this.onCloseFabPrivateKey.next(privateKey);
                    this.onClose.next(seed);
                    this.bsModalRef.hide();
                }
  
            },
            error => {
                // console.log('errorrrr=', error);
            }
        );


    }

    close() {
        this.bsModalRef.hide();
    }
    warnPwdErr() {
        this.toastr.error(this.translateServ.instant('Your password is invalid.'));
    }   
}
