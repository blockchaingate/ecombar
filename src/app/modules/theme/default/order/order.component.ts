import { Component, OnInit } from '@angular/core';
import { OrderClientComponent as ParentOrderComponent } from 'src/app/modules/store/order/order-c.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: [
    './order.component.scss',
    '../../../../../page.scss'
  ]
})
export class OrderComponent extends ParentOrderComponent{}
