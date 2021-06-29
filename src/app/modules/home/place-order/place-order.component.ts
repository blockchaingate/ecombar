import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { AddressService } from '../../shared/services/address.service';
import { OrderService } from '../../shared/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-place-order',
  providers: [UserService],
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss', '../../../../select.scss', '../../../../button.scss']
})
export class PlaceOrderComponent implements OnInit {

  id: string;
  order: any;
  orderID: string;
  total: number;
  subtotal: number;
  selectedShippingService: string;
  selectedPayment: string;
  shippingFee: number;
  trans_code: string;
  payLink: string;
  code: string;
  link: string;
  ps_store_id: string;
  hpp_key: string;
  public payPalConfig?: IPayPalConfig;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private orderServ: OrderService,
    private addressServ: AddressService) {

  }

  payWithCreditCard() {
    window.open('https://esqa.moneris.com/HPPDP/index.php?ps_store_id='
      + this.ps_store_id + '&hpp_key=' + this.hpp_key
      + '&order_id=' + this.orderID
      + '&charge_total=' + this.total.toFixed(2), '_blank');
  }

  ngOnInit() {
    this.ps_store_id = environment.moneris.ps_store_id;
    this.hpp_key = environment.moneris.hpp_key;

    this.orderID = this.route.snapshot.paramMap.get('orderID');
    this.orderServ.get(this.orderID).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.order = res._body;

          console.log('this.order=', this.order);
          this.code = 'n.' + this.order.num;
          this.payLink = environment.endpoints.website + 'ex/' + this.code;
          this.subtotal = this.order.totalSale;
          this.shippingFee = this.order.totalShipping;
          this.total = this.order.totalToPay;
          const currency = 'USD';
          const items = this.order.items;

          const value = this.total.toString();
          this.payPalConfig = {
            currency,
            clientId: environment.paypal_client_id,
            createOrderOnClient: (data) => <ICreateOrderRequest>{
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value,
                    breakdown: {
                      item_total: {
                        currency_code: currency,
                        value
                      }
                    }
                  },
                  items: [{
                    name: 'Enterprise Subscription',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                      currency_code: currency,
                      value,
                    },
                  }]

                }
              ]
            },
            advanced: {
              commit: 'true'
            },
            style: {
              label: 'paypal',
              layout: 'vertical'
            },
            onApprove: (data, actions) => {
              console.log('onApprove - transaction was approved, but not authorized', data, actions);
              const orderID = data.orderID;
              const payerID = data.payerID;

              actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
              });
            },
            onClientAuthorization: (data) => {
              console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
              const orderID = data.id;
              if (orderID) {

                console.log('orderID=', orderID);
                this.orderServ.updatePayment(this.orderID, data).subscribe(
                  (res2: any) => {
                    if (res2 && res2.ok) {
                      this.toastr.success('Your payment was confirmed.', '');

                    }
                  }
                );
              }
            },
            onCancel: (data, actions) => {
              console.log('OnCancel', data, actions);
            },
            onError: err => {
              console.log('OnError', err);
            },
            onClick: (data, actions) => {
              console.log('onClick', data, actions);
            },
          };


        }
      }
    );
  }

  dlDataUrlBin() {
    const y = document.getElementById('address_qr_code').getElementsByTagName('canvas')[0];
    // console.log('y.src=' + y.src);
    if (y) {
      const link = y.toDataURL('image/png');
      this.link = link;
    }

  }

  change() {
    this.router.navigate(['/payment/' + this.orderID]);
  }

  payWithPaypal() {

  }

  payWithWeb() {
    console.log('begin payWithWeb');


    console.log('this.payLink==', this.payLink);
    window.open(this.payLink, '_blank');
    /*
    const items = [];
    let merchantId = '';
    let currency = '';
    let trans_amount = this.total;
    for(let i=0;i<this.order.items.length; i++) {
      const item = this.order.items[i];
      merchantId = item.merchantId;
      currency = item.currency;
      items.push({
        productId: item._id,
        title: item.title,
        currency: item.currency,
        quantity: item.quantity,
        price: item.price
      });
    }

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
      out_order_no: this.orderID,
      trans_currency: currency,
      trans_amount: trans_amount,
      description: "this is a transaction for " + this.orderID,
      notify_url: "https://notify-url",
      attach: JSON.stringify(items),
      effective_minutes: 15
    }
    this.apiServ.qrcodepay(data).subscribe(
        (res: any) => {
          if(res.ok) {
            this.trans_code = res._body.trans_code;
            this.payLink = environment.endpoints.website + 'ex/' + this.trans_code;
            console.log('this.payLink===', this.payLink);
            window.open(this.payLink, "_blank");
            //this.startTimer();
          }

        }
    );
    */
  }

}
