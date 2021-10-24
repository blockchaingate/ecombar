import { Component, OnInit } from '@angular/core';
import {OrderComponent as ParentOrderComponent} from 'src/app/modules/store/order/order.component';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent extends ParentOrderComponent{}