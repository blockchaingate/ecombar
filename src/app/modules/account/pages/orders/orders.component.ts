import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin-orders',
  providers: [OrderService],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss', '../../../../../table.scss']
})
export class OrdersComponent implements OnInit {
  orders: any;
  order: any;
  customerFlag: boolean;
  modalRef: BsModalRef;
  wallet: any;
  constructor(
    public kanbanServ: KanbanService,
    private modalService: BsModalService,
    private dataServ: DataService,
    private orderServ: OrderService) {
  }

  ngOnInit() {
    this.dataServ.currentWallet.subscribe(
      (wallet: string) => {
        this.wallet = wallet;
      }
    ); 

    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.orderServ.getMyOrders(walletAddress).subscribe(
          (res: any) => {
              if(res && res.ok) {
                this.orders = res._body;
              }
          }
        ); 
      }
    );
  }

  getItemsCount(order) {
    let count = 0;
    let items = order.items;
    for(let i=0;i<items.length;i++) {
      const item = items[i];
      if(item.quantity) {
        count += item.quantity;
      }
      
    }
    return count;
  }

  trimText(id:string) {
    return id.substring(0,3) + '...' + id.substring(id.length - 3);
  }
  getStatus(order) {
    let status = '';
    const paymentStatus = order.paymentStatus;
    if(!paymentStatus) {
      status = 'waiting for pay';
    } else 
    if(paymentStatus == 1) {
      status = 'paid already';
    } else 
    if(paymentStatus == 2) {
      status = 'payment confirmed';
    } else 
    if(paymentStatus == 3) {
      status = 'payment cancelled';
    } else 
    if(paymentStatus == 4) {
      status = 'payment frozened';
    }
    return status;
  }

  deleteOrder(order) {
    this.orderServ.delete(order._id).subscribe(
      (res: any) => {
        
      }
    );
  }

  requestReturn(order) {
    this.order = order;
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      this.requestReturnDo(seed);
    });
  }
  
  requestReturnDo(seed: Buffer) {

  }

}
