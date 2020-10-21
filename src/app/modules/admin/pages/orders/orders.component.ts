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
  constructor(
    private userServ: UserService,
    private authServ: AuthService,
    private merchantServ: MerchantService,
    private router: Router,
    private orderServ: OrderService) {
  }

  ngOnInit() {
      this.orderServ.getMyOrders().subscribe(
          (res: any) => {
              if(res && res.ok) {
                this.orders = res._body;
              }
          }
      );
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
      status = 'finished';
    } else 
    if(paymentStatus == 3) {
      status = 'cancelled';
    } else 
    if(paymentStatus == 4) {
      status = 'frozened';
    }
    return status;
  }
}
