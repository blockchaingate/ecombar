import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { OrderService } from '../../../shared/services/order.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-refund',
    templateUrl: './refund.component.html',
    styleUrls: ['./refund.component.scss']
  })
  export class RefundComponent implements OnInit {
      order: any;
      realOrder: any;
      refundItem: any;
      items: any;
      public onClose: Subject<any>;
      constructor(
        private orderServ: OrderService,
        private modalRef: BsModalRef) {
      }
      ngOnInit(): void {
        this.onClose = new Subject();

        this.items = [];
        for(let i = this.realOrder.refunds.length - 1; i >= 0 ; i++) {
            const item = this.realOrder.refunds[i];
            if(!item.status) {
                this.refundItem = item;
                for(let j = 0; j < this.refundItem.items.length;j++) {
                    for(let k = 0; k < this.realOrder.items.length; k++) {
                        if(this.refundItem.items[j].id == this.realOrder.items[k]._id) {
                            this.refundItem.items[j]['title'] = this.realOrder.items[k].title;
                            this.refundItem.items[j]['price'] = this.realOrder.items[k].price;
                        }
                    }
                }
                break;
            }
        }

      }
      refund() {
          this.onClose.next(this.refundItem);
          this.modalRef.hide();
      }
      close() {
        this.modalRef.hide();
      }
  }