import { NgModule } from '@angular/core';
import { PaymentRoutingModule } from './payment-routing.module';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { NgxSpinnerModule } from "ngx-bootstrap-spinner";  // 只支持到 @angular/common@^10.0.0

@NgModule({
  declarations: [
    PaymentComponent
  ],
  imports: [
    PaymentRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    // NgxSpinnerModule,
    ModalModule.forRoot()
  ],
  providers: []
})
export class PaymentModule { }
