import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { OrderService } from '../../../shared/services/order.service';

@Component({
  selector: 'app-admin-shipping',
  providers: [],
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class ShippingComponent implements OnInit{
    serviceName: string;
    trackingNumber: string;
    status: number;
    orderID: string;

    statuses = [
        {
            name: 'not started',
            value: 0
        },
        {
          name: 'sent',
          value: 1
        },
        {
          name: 'received',
          value: 2
        }
    ];

    constructor(
      private userServ: UserService,
      private authServ: AuthService,
      private route: ActivatedRoute, 
      private orderServ: OrderService,
      private router: Router) {

    }

    ngOnInit() {
      this.orderID = this.route.snapshot.paramMap.get('orderID');
      this.orderServ.get(this.orderID).subscribe(
        (res: any) => {
          if(res && res.ok) {
            const data = res._body;
            console.log('data=', data);
            this.serviceName = data.shippingServiceIdSelected;
            this.trackingNumber = data.trackingNumber,
            this.status = data.shippingStatus
          }
        }
      );
    }

    update() {
      const data = {
        shippingServiceIdSelected: this.serviceName,
        shippingStatus: this.status,
        shippedTime: null,
        trackingNumber: this.trackingNumber
      }
      if(this.status == 1) {
        data.shippedTime = Date.now();
      }

      this.orderServ.updateShipping(this.orderID, data).subscribe(
        (res: any) => {
          if(res && res.ok) {
            console.log('updated successfully');
          }
        }
      );
    }
}

/*
    shippingMethodSelected: Boolean,
    shippingServiceSelected: String,
    shippingServiceIdSelected: String,
    shippedTime: Date,

    active: Boolean,
    
    checkoutStatus: Boolean,
    paymentStatus: Number, //0: waiting for pay, 1: paid already, 2: finished, 3: cancelled, 4: frozened 
    shippingStatus: Number, //0: not started, 1: sent, 2: received
*/