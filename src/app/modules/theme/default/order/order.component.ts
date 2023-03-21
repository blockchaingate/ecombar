import { Component, OnInit } from '@angular/core';
import { OrderMineComponent as ParentOrderComponent } from 'src/app/modules/store/order/order-mine.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: [
    './order.component.scss',
    '../../../../../page.scss'
  ]
})
export class OrderComponent extends ParentOrderComponent{}
