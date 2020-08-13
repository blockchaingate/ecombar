import { Component, OnInit } from '@angular/core';
import { CartStoreService } from '../../shared/services/cart.store.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-cart',
    providers: [ApiService],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
    constructor(
      private cartStoreServ: CartStoreService,
      private apiServ: ApiService
      ) {

    }
    cartItems : any;
    ngOnInit() {
      this.cartStoreServ.items$.subscribe(
        value => {
          this.cartItems = value;
        }
      );
    }

    pay() {
      const data = {
        app_id: "6bf9403d0c97bd24",
        format: "JSON",
        charset: "UTF-8",
        sign_type: "MD5",
        sign: "7e2083699dd510575faa1c72f9e35d43",
        version: "1.0",
        timestamp: "2018-08-02 15:16:51",
        method: "pay.qrcodepay",
        merchant_no: "901800002555",
        payment_method: "WECHATPAY",
        out_order_no: "12345678",
        trans_currency: "USDT",
        trans_amount: 100.5,
        description: "this is a test transaction",
        notify_url: "https://notify-url",
        attach: "{\"orderId\": \"12345\"}\"",
        effective_minutes: 15,
        extension_parameters: "{\"store_no\": \"80000026\"}"
      }
      this.apiServ.qrcodepay(data).subscribe(
          (res: any) => {
            console.log('res==', res);
          }
      );
    }
}
