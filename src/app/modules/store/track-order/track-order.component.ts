
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  template:''
})
export class TrackOrderComponent implements OnInit {
  orderId: string;
  order: any;
  storeId: string;
  selectedPayment: string;
  selectedShippingService: string;
  shippingFee: number;
  subtotal: number;
  total: number;
  currency: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataServ: DataService,
    private orderServ: OrderService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) =>  {
      this.orderId = params.get('id');    
      if(this.orderId) {
        this.onSearch();
      }
    });
    this.dataServ.currentStoreId.subscribe(
      (storeId: string) => {
        this.storeId = storeId;
      }
    );
  }

  onSearch() {
    this.orderServ.get(this.orderId).subscribe(
      (ret: any) => {
        // console.log('ret=', ret);
        if (ret) {  // ret && ret.ok
          this.order = ret;  // ret._body
          this.currency = this.order.currency;
          this.selectPayment(this.order.paymentMethod);
          this.selectShippingService(this.order.shippingServiceSelected);
        }
      }
    );
  }

  change() {
    this.router.navigate(['/store/' + this.storeId + '/address/' + this.orderId]);
  }

  selectPayment(payment: string) {
    if(!payment) {
      return;
    }

    this.selectedPayment = payment;
  }   

  selectShippingService(service: string) {
    console.log('service=', service);
    if(!service) {
      return;
    }
    this.selectedShippingService = service;
    if(service == 'express') {
      this.shippingFee = 10;
    } else {
      this.shippingFee = 0;
    }
    this.calculateTotal();
  }  

  calculateTotal() {
    this.subtotal = 0;
    this.total = 0;
    if(!this.order || !this.order.items || (this.order.items.length == 0)) {
      return;
    }
    console.log('this.images5');
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
}
