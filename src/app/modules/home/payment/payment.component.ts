import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { AddressService } from '../../shared/services/address.service';
import { OrderService } from '../../shared/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  providers: [UserService],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss', '../../../../select.scss', '../../../../button.scss']
})
export class PaymentComponent implements OnInit{

    id: string;
    order: any;
    orderID: string;
    total: number;
    subtotal: number;
    selectedShippingService: string;
    selectedPayment: string;
    shippingFee: number;

    constructor(
      private router: Router,
      private route: ActivatedRoute, 
      private userServ: UserService, 
      private orderServ: OrderService, 
      private addressServ: AddressService) {

    }

    calculateTotal() {
      this.subtotal = 0;
      this.total = 0;
      if(!this.order || !this.order.items || (this.order.items.length == 0)) {
        return;
      }
      for(let i=0;i<this.order.items.length;i++) {
        const item = this.order.items[i];
        this.subtotal += item.price * item.quantity;
        console.log('');
      }
      
      this.subtotal = Number(this.subtotal.toFixed(2));
      this.total = this.subtotal;
      this.total += this.shippingFee;

      this.total = Number(this.total.toFixed(2));
    }

    ngOnInit() {
      this.shippingFee = 0;
      this.total = 0;
      this.subtotal = 0;
      this.orderID = this.route.snapshot.paramMap.get('orderID');
      this.orderServ.get(this.orderID).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.order = res._body;
            console.log('this.order=', this.order);
            this.calculateTotal();
          }
        }
      );

    }

    selectShippingService(service: string) {
      this.selectedShippingService = service;
      if(service == 'express') {
        this.shippingFee = 10;
      } else {
        this.shippingFee = 0;
      }
      this.calculateTotal();
    }

    selectPayment(payment: string) {
      this.selectedPayment = payment;
    }   
    
/*
    totalSale: Number,
    totalShipping: Number,
*/
    
    placeOrder() {
      if (!this.selectedShippingService) {
        return;
      }
      if (!this.selectedPayment) {
        return;
      }  
          
      const item = {
        totalSale: this.subtotal,
        totalShipping: this.shippingFee,
        totalToPay: this.total,
        paymentMethod: this.selectedPayment,
        paymentStatus: 0,
        shippingServiceSelected: this.selectedShippingService
      }
      this.orderServ.update(this.orderID, item).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.router.navigate(['/place-order/' + this.orderID]);
          }
        }
      );
    }
}