import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartStoreService } from '../../shared/services/cart.store.service';
import { OrderService } from '../../shared/services/order.service';
import { UserService } from '../../shared/services/user.service';
import { ApiService } from '../../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  providers: [ApiService, OrderService, UserService],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', '../../../../button.scss']
})
export class CartComponent implements OnInit, OnDestroy {
    interval;
    cartItems : any;
    payLink: string;
    total: any;
    paidConfirmed: boolean;
    txid: string;
    payQrcode: string;
    txid_link: string;
    trans_code: string;
    constructor(
      private userServ: UserService,
      private cartStoreServ: CartStoreService,
      private orderServ: OrderService,
      private router: Router,
      private apiServ: ApiService
      ) {

    }



    ngOnInit() {
      this.cartItems = this.cartStoreServ.items;

      this.total = [];

      for(let i=0;i<this.cartItems.length; i++) {
        const cartItem = this.cartItems[i];
        let inTotal = false;
        for(let j=0;j<this.total.length;j++) {
          const totalItem = this.total[j];
          if(totalItem.currency == cartItem.currency) {
            totalItem.total += cartItem.price * cartItem.quantity;
            inTotal = true;
          }
        }
        if(!inTotal) {
          this.total.push({
            currency : cartItem.currency,
            total : cartItem.price * cartItem.quantity
          });
        }
      }      
    }

    startTimer() {
      this.interval = setInterval(() => {
        this.apiServ.checkPaymentStatus(this.trans_code).subscribe(
          (res: any) => {
            if(res && res.ok) {
              const data = res._body;
              if(data.trans_status == 'paid') {
                this.paidConfirmed = true;
                this.txid = data.txid;
                this.txid_link = environment.endpoints.website + 'explorer/tx-detail/' + this.txid;
                this.pauseTimer();  
              }
              
            }
          }
        );
      },1000)
    }

    checkout() {
      this.router.navigate(['/address']);
    }

    pay() {
      const items = [];
      let merchantId = '';
      let currency = '';
      let trans_amount = 0;
      for(let i=0;i<this.cartItems.length; i++) {
        const item = this.cartItems[i];
        merchantId = item.merchantId;
        currency = item.currency;
        trans_amount += item.quantity * item.price;
        items.push({
          productId: item._id,
          title: item.title,
          currency: item.currency,
          quantity: item.quantity,
          price: item.price
        });
      }

      const orderData = {
        token: this.userServ.getToken(),
        merchantId: merchantId,
        items:items,
      };
      
      this.orderServ.create(orderData).subscribe(
        (res: any) => {
          if(res && res._id) {
            const out_order_no = res._id;

            const data = {
              app_id: "6bf9403d0c97bd24",
              format: "JSON",
              charset: "UTF-8",
              sign_type: "MD5",
              sign: "7e2083699dd510575faa1c72f9e35d43",
              version: "1.0",
              timestamp: "2018-08-02 15:16:51",
              method: "pay.qrcodepay",
              merchant_no: merchantId,
              payment_method: "WEB",
              out_order_no: out_order_no,
              trans_currency: currency,
              trans_amount: trans_amount,
              description: "this is a transaction for " + out_order_no,
              notify_url: "https://notify-url",
              attach: JSON.stringify(items),
              effective_minutes: 15
            }
            this.apiServ.qrcodepay(data).subscribe(
                (res: any) => {
                  if(res.ok) {
                    this.trans_code = res._body.trans_code;
                    this.payLink = environment.endpoints.website + 'ex/' + this.trans_code;
                    this.startTimer();
                  }

                }
            );            
          }
        }
      );

    }


    pauseTimer() {
      if(this.interval) {
        clearInterval(this.interval);
      }
      
    }
    ngOnDestroy() {
      this.pauseTimer();
    }
}
