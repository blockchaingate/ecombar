import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.component.html',
    styleUrls: ['./withdraw.component.scss']
  })
  export class WithdrawComponent implements OnInit {
    public onClose: Subject<number>;
    withdrawAmount: number;
    constructor(public modalRef: BsModalRef) {
    }   

    ngOnInit() {
        this.onClose = new Subject();
    }

    close() {
        this.modalRef.hide();
    }

    confirm() {
        this.onClose.next(this.withdrawAmount);
        this.modalRef.hide();
    }
  }