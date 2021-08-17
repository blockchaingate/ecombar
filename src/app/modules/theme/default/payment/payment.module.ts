import { NgModule } from '@angular/core';
import { PaymentRoutingModule } from './payment-routing.module';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  declarations: [
    PaymentComponent
  ],
  imports: [
    PaymentRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    NgxSmartModalModule.forRoot()
  ],
  providers: []
})
export class PaymentModule { }
