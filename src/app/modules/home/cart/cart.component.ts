import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartStoreService } from '../../shared/services/cart.store.service';
import { OrderService } from '../../shared/services/order.service';
import { PaymentService } from '../../shared/services/payment.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '../../shared/services/translate.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', '../../../../button.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  interval;
  cartItems: any;
  payLink: string;
  total: any;
  paidConfirmed: boolean;
  txid: string;
  payQrcode: string;
  txid_link: string;
  trans_code: string;
  constructor(
    private paymentServ: PaymentService,
    private cartStoreServ: CartStoreService,
    private orderServ: OrderService,
    private router: Router,
    private translateServ: TranslateService
  ) {

  }

  calculateTotal() {
    this.total = [];

    for (let i = 0; i < this.cartItems.length; i++) {
      const cartItem = this.cartItems[i];
      let inTotal = false;
      for (let j = 0; j < this.total.length; j++) {
        const totalItem = this.total[j];
        if (totalItem.currency == cartItem.currency) {
          totalItem.total += (cartItem.price * cartItem.quantity);
          totalItem.total = Number(totalItem.total.toFixed(2));
          inTotal = true;
        }
      }
      if (!inTotal) {
        this.total.push({
          currency: cartItem.currency,
          total: Number((cartItem.price * cartItem.quantity).toFixed(2))
        });
      }
    }
  }

  ngOnInit() {
    this.cartItems = this.cartStoreServ.items;
    this.calculateTotal();
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.paymentServ.checkPaymentStatus(this.trans_code).subscribe(
        (res: any) => {
          if (res && res.ok) {
            const data = res._body;
            if (data.trans_status == 'paid') {
              this.paidConfirmed = true;
              this.txid = data.txid;
              this.txid_link = environment.endpoints.website + 'explorer/tx-detail/' + this.txid;
              this.pauseTimer();
            }

          }
        }
      );
    }, 1000)
  }

  checkout() {
    const items = [];
    let merchantId = '';
    let currency = '';
    let trans_amount = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      const item = this.cartItems[i];
      console.log('item=', item);
      merchantId = item.merchantId;
      currency = item.currency;
      trans_amount += item.quantity * item.price;
      items.push({
        productId: item._id,
        title: this.translateServ.transField(item.title),
        currency: item.currency,
        quantity: item.quantity,
        thumbnailUrl: item.image,
        price: item.price
      });
    }

    const orderData = {
      merchantId: merchantId,
      items: items,
    };

    this.orderServ.create(orderData).subscribe(
      (res: any) => {
        console.log('ress from create order', res);
        if (res && res.ok) {
          const body = res._body;
          const orderID = body._id;
          this.router.navigate(['/address/' + orderID]);
        }
      }
    );
  }

  remove(item) {
    console.log('item==', item);
    const product_id = item.product_id;
    this.cartItems = this.cartItems.filter((item) => item.product_id != product_id);
    this.cartStoreServ.saveCartItems(this.cartItems);
    this.calculateTotal();
  }

  pauseTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }

  }

  ngOnDestroy() {
    this.pauseTimer();
  }
}
