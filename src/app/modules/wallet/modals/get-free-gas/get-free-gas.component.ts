import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { AirdropService } from '../../../shared/services/airdrop.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-get-free-gas',
    templateUrl: './get-free-gas.component.html',
    styleUrls: ['./get-free-gas.component.scss']
})
export class GetFreeGasComponent implements OnInit {
    address: string;
    question: string;
    questionair_id: string;
    answer: string;
    error: string;

    public onClose: Subject<number>;
    constructor(public modalRef: BsModalRef,
        private airdropServ: AirdropService, 
        private http: HttpClient
        ) {
    }   

    ngOnInit() {
        this.onClose = new Subject();

        this.http.get('https://api.ipify.org?format=json').toPromise().then(data => {
            const publicIP = data['ip'];

            this.airdropServ.getQuestionair(this.address, publicIP).subscribe(
                (res: any) => {
                    if (res) {
                        const data = res._body;
                        if (res.ok) {
    
                            this.question = data.question;
                            this.questionair_id = data._id;
                        } else {
                            this.error = data;
                        }
    
                    }
                }
            );            
        });
    }

    close() {
        this.modalRef.hide();
    }

    confirm() {
        //this.onClose.next(this.gasAmount);
        this.airdropServ.answerQuestionair(this.address, this.questionair_id, this.answer).subscribe(
            (res: any) => {
                if (res) {
                    if (res.ok) {
                        this.onClose.next(1);
                        this.close();
                        //return this.alertServ.openSnackBarSuccess('Congrat, you will get free Gas shortly', 'Ok');
                    }
                    //return this.alertServ.openSnackBar(res._body, 'Ok');
                }

            }
        );
    }
}