import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { AddressService } from '../../shared/services/address.service';
import { OrderService } from '../../shared/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '../../shared/services/util.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { IddockService } from '../../shared/services/iddock.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-payment',
  providers: [UserService],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss', '../../../../select.scss', '../../../../button.scss']
})
export class PaymentComponent implements OnInit{

    id: string;
    order: any;
    discount: number;
    orderID: string;
    total: number;
    subtotal: number;
    selectedShippingService: string;
    selectedPayment: string;
    shippingFee: number;
    noWallet: boolean;
    wallet: any;
    wallets: any;
    password: string;

    constructor(
      private iddockServ: IddockService,
      private utilServ: UtilService,
      private ngxSmartModalServ: NgxSmartModalService,    
      private localSt: LocalStorage,      
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

    ngOnInit() {

      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

        if(!wallets || (wallets.length == 0)) {
          this.noWallet = true;
          return;
        }
        this.wallets = wallets;
        console.log('this.wallets==', this.wallets);
        this.wallet = this.wallets.items[this.wallets.currentIndex];
      });  

      this.discount = 0;
      this.shippingFee = 0;
      this.total = 0;
      this.subtotal = 0;
      this.orderID = this.route.snapshot.paramMap.get('orderID');
      this.orderServ.get(this.orderID).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.order = res._body;
            console.log('this.order=', this.order);
            this.selectPayment(this.order.paymentMethod);
            this.selectShippingService(this.order.shippingServiceSelected);
            this.calculateTotal();
          }
        }
      );

    }

    change() {
      this.router.navigate(['/address/' + this.orderID]);
    }
    
    selectShippingService(service: string) {
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

    selectPayment(payment: string) {
      if(!payment) {
        return;
      }
      if(payment == 'usdt') {
        this.discount = 3;
      } else {
        this.discount = 0;
      }
      this.selectedPayment = payment;
    }   

    placeOrder() {
      if (!this.selectedShippingService) {
        return;
      }
      if (!this.selectedPayment) {
        return;
      }  

      this.ngxSmartModalServ.getModal('passwordModal').open();
  
    }
  
    onConfirmPassword(event) {
        this.ngxSmartModalServ.getModal('passwordModal').close();
        this.password = event;
        this.placeOrderDo();     
    }  
    
    async placeOrderDo() {
      const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.password); 


      const item = {
        totalSale: this.subtotal,
        totalShipping: this.shippingFee,
        totalToPay: this.total * (1 - this.discount / 100),
        paymentMethod: this.selectedPayment,
        paymentStatus: 0,
        shippingServiceSelected: this.selectedShippingService
      }

      const updatedOrderForIdDock = {
        merchantId: this.order.merchantId,
        items: this.order.items,
        currency: this.order.currency,
        transAmount: this.order.transAmount,
        name: this.order.name,
        unit: this.order.suite,
        streetNumber: this.order.streetNumber,
        streetName: this.order.street,
        city: this.order.city,
        province: this.order.province,
        zip: this.order.postcode,
        country: this.order.country,
        ...item
      }; 


      (await this.iddockServ.updateIdDock(seed, this.order.objectId, 'things', null, updatedOrderForIdDock, null)).subscribe(res => {
        if(res) {
          if(res.ok) {
            this.orderServ.update(this.orderID, item).subscribe(
              (res: any) => {
                if(res && res.ok) {
                  this.router.navigate(['/place-order/' + this.orderID]);
                }
              }
            );
          } else {
  
          }
          
        }
      });




    }
}