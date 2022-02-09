import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { OrderService } from '../../../shared/services/order.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-request-refund',
    templateUrl: './request-refund.component.html',
    styleUrls: ['./request-refund.component.scss']
  })
  export class RequestRefundComponent implements OnInit {
      refundAll: boolean;
      order: any;
      realOrder: any;
      items: any;
      public onClose: Subject<any>;
      constructor(
        private orderServ: OrderService,
        private modalRef: BsModalRef) {
      }
      ngOnInit(): void {
        this.onClose = new Subject();

        this.items = [];
        this.refundAll = true;
        for(let i = 0; i < this.realOrder.items.length; i++) {
            const newItem = {
              id: this.realOrder.items[i]._id,
              title: this.realOrder.items[i].title,
              quantity: 0
            }
            this.items.push(newItem);
        }

      }
      requestRefund() {
          const data = {
            refundAll: this.refundAll,
            items: this.items
          };
          this.onClose.next(data);
          this.modalRef.hide();
      }
      close() {
        this.modalRef.hide();
      }
  }