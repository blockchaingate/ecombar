import { NgModule } from '@angular/core';
import { PlaceOrderRoutingModule } from './place-order-routing.module';
import { CommonModule } from '@angular/common';
import { PlaceOrderComponent } from './place-order.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  declarations: [
    PlaceOrderComponent
  ],
  imports: [
    PlaceOrderRoutingModule,
    CommonModule,
    FormsModule,
    QRCodeModule,
    SharedModule,
    NgxPayPalModule,
    NgxSmartModalModule.forRoot()
  ],
  providers: []
})
export class PlaceOrderModule { }
