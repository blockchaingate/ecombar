import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { UserService } from '../../../shared/services/user.service';
import { MerchantService } from '../../../shared/services/merchant.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'app-admin-orders',
  providers: [OrderService],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss', '../../../../../table.scss']
})
export class OrdersComponent implements OnInit {
  orders: any;
  customerFlag: boolean;
  constructor(
    private userServ: UserService,
    private storageServ: StorageService,
    private merchantServ: MerchantService,
    private orderServ: OrderService) {
  }

  getOrders(merchantId: string, isSystemAdmin: boolean) {
    if(isSystemAdmin) {
      this.orderServ.getAllOrders().subscribe(
        (res: any) => {
            if(res && res.ok) {
              this.orders = res._body;
            }
        }
      );
    } else 
    if(merchantId) {
      this.orderServ.gerMerchantOrders().subscribe(
        (res: any) => {
            if(res && res.ok) {
              this.orders = res._body;
            }
        }
      );
    } else {
      this.customerFlag = true;
      this.orderServ.getMyOrders().subscribe(
        (res: any) => {
            if(res && res.ok) {
              this.orders = res._body;
            }
        }
      );
    }
  }
  getMerchantOrders(merchantId: string) {


    if(this.userServ.isSystemAdmin) {
      this.getOrders(merchantId, this.userServ.isSystemAdmin);
    } else {
      this.storageServ.get('_isSystemAdmin').subscribe(
        (ret:boolean) => {
          this.getOrders(merchantId, ret);
        }
      );      
    }

  }
  ngOnInit() {
    const merchantId = this.merchantServ.id;
    if(merchantId) {
      this.getMerchantOrders(merchantId);
    } else {
      this.storageServ.get('_merchantId').subscribe(
        (ret: any) => {
          this.getMerchantOrders(ret);
        }
      );        
    }


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
}
