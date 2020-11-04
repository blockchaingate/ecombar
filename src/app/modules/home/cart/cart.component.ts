import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CartStoreService } from '../../shared/services/cart.store.service';
import { OrderService } from '../../shared/services/order.service';
import { PaymentService } from '../../shared/services/payment.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '../../shared/services/translate.service';
import { CartItem } from '../../shared/models/cart-item';
import { groupBy } from '../../shared/utils/array-tool';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', '../../../../button.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  interval;
  cartItems: CartItem[];
  payLink: string;
  @Input() noPadding: boolean;
  Total: { currency: string, total: string }[];
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

  calculateTotal(): void {
    this.Total = [];

    const grouped = groupBy(this.cartItems, (cI: CartItem) => cI.currency);

    grouped.forEach((currencyGroup: CartItem[]) => {
      let value = 0;
      const final = currencyGroup.map((v: CartItem) => value += v.price * v.quantity);
      this.Total.push({ currency: currencyGroup[0].currency, total: value.toFixed(2) });
    });
  }

  ngOnInit(): void {
    this.cartItems = this.cartStoreServ.items;
    this.calculateTotal();
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      this.paymentServ.checkPaymentStatus(this.trans_code).subscribe(
        (res: any) => {
          if (res && res.ok) {
            const data = res._body;
            if (data.trans_status === 'paid') {
              this.paidConfirmed = true;
              this.txid = data.txid;
              this.txid_link = environment.endpoints.website + 'explorer/tx-detail/' + this.txid;
              this.pauseTimer();
            }

          }
        }
      );
    }, 1000);
  }

  checkout(): void {
    const items: CartItem[] = [];
    let merchantId = '';
    let currency = '';
    let transAmount = 0;

    this.cartItems.forEach(item => {
      console.log('item=', item);
      merchantId = item.merchantId;
      currency = item.currency;
      transAmount += item.quantity * item.price;
      item.title = this.translateServ.transField(item.title);
      items.push(item);
    });

    const orderData = { merchantId, items, currency, transAmount };

    this.orderServ.create(orderData).subscribe(
      (res: any) => {
        console.log('ress from create order', res);
        if (res && res.ok) {
          const body = res._body;
          const orderID = body._id;
          this.cartStoreServ.empty();
          this.router.navigate(['/address/' + orderID]);
        }
      }
    );
  }

  clear() {
    this.cartItems = [];
    this.cartStoreServ.empty();
  }

  updateProduct(item) {
    console.log('this.images3');
    const product = item.product;
    const quantity = item.quantity;
    const productId = product.productId;
    if(quantity == 0) {
      this.cartItems = this.cartItems.filter((itm) => itm.productId !== productId);
    } else {
      for(let i=0;i<this.cartItems.length;i++) {
        if(this.cartItems[i].productId == productId) {
          this.cartItems[i].quantity = quantity;
        }
      }
    }
    this.cartStoreServ.saveCartItems(this.cartItems);
    this.calculateTotal();
  }

  pauseTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

  }

  calcTotal() {
    return this.cartItems.reduce(
      (acc, prod) => acc+= prod.quantity ,0
    );
  }

  ngOnDestroy(): void {
    this.pauseTimer();
  }
}
