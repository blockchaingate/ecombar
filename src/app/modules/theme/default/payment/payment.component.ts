import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/shared/services/user.service';
import {PaymentComponent as ParentPaymentComponent} from 'src/app/modules/store/payment/payment.component';

@Component({
  selector: 'app-payment',
  providers: [UserService],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent extends ParentPaymentComponent{}
