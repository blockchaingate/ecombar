import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.scss']
  })
  export class DepositComponent implements OnInit {
    public onClose: Subject<number>;
    depositAmount: number;
    constructor(public modalRef: BsModalRef) {
    }   

    ngOnInit() {
        this.onClose = new Subject();
    }

    close() {
        this.modalRef.hide();
    }

    confirm() {
        this.onClose.next(this.depositAmount);
        this.modalRef.hide();
    }
  }