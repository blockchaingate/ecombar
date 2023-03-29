import { Component, OnInit } from '@angular/core';
import { OrderMerchantComponent as ParentOrderComponent } from 'src/app/modules/store/order/order-m.component';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent extends ParentOrderComponent{}