import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MerchantService } from '../../../shared/services/merchant.service';

@Component({
  selector: 'app-admin-orders',
  providers: [OrderService],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss', '../../../../../table.scss', '../../../../../button.scss']
})
export class OrdersComponent implements OnInit {
  orders: any;
  customerFlag: boolean;
  constructor(
    private userServ: UserService,
    private authServ: AuthService,
    private merchantServ: MerchantService,
    private router: Router,
    private orderServ: OrderService) {
  }

  ngOnInit() {
    const merchantId = this.merchantServ.id;
    if(this.userServ.isSystemAdmin) {
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

  getItemsCount(order) {
    let count = 0;
    let items = order.items;
    for(let i=0;i<items.length;i++) {
      if(items[i].quantity) {
        count += items[i].quantity;
      }
      
    }
    return count;
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
