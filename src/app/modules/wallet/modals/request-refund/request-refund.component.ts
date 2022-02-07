import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-request-refund',
    templateUrl: './request-refund.component.html',
    styleUrls: ['./request-refund.component.scss']
  })
  export class RequestRefundComponent implements OnInit {
      constructor(public modalRef: BsModalRef) {
      }
      ngOnInit(): void {
          
      }
      refundAll() {
          
      }
      close() {
        this.modalRef.hide();
      }
  }