import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { Store } from '@ngrx/store';
import { UserState } from 'src/app/store/states/user.state';

@Component({
  selector: 'app-admin-orders',
  providers: [OrderService],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss', ]
})
export class OrdersComponent implements OnInit {
  orders: any;
  customerFlag: boolean;
  constructor(
    private store: Store<{ user: UserState }>,
    private orderServ: OrderService) {
  }

  ngOnInit() {


    this.store.select('user').subscribe(
      (userState: UserState) => {
        const role = userState.role;
        const merchantId = userState.merchantId;
        if(role == 'Admin') {
          this.orderServ.getAllOrders().subscribe(
            (res: any) => {
                if(res && res.ok) {
                  this.orders = res._body;
                }
            }
          );
        } else
        if((role == 'Seller') && merchantId) {
          this.orderServ.gerMerchantOrders().subscribe(
            (res: any) => {
                if(res && res.ok) {
                  this.orders = res._body;
                }
            }
          );
        } else
        if(role == 'Customer') {
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
}
