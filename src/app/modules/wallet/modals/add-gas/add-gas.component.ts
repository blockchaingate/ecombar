import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-add-gas',
    templateUrl: './add-gas.component.html',
    styleUrls: ['./add-gas.component.scss']
  })
  export class AddGasComponent implements OnInit {
    public onClose: Subject<number>;
    gasAmount: number;
    constructor(public modalRef: BsModalRef) {
    }   

    ngOnInit() {
        this.onClose = new Subject();
    }

    close() {
        this.modalRef.hide();
    }

    confirm() {
        this.onClose.next(this.gasAmount);
        this.modalRef.hide();
    }
  }