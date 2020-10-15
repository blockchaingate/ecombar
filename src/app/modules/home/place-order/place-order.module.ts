import { NgModule } from '@angular/core';
import { PlaceOrderRoutingModule } from './place-order-routing.module';
import { CommonModule } from '@angular/common';
import { PlaceOrderComponent } from './place-order.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PlaceOrderComponent
  ],
  imports: [
    PlaceOrderRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule
  ],
  providers: []
})
export class PlaceOrderModule { }
