import { NgModule } from '@angular/core';
import { AddressRoutingModule } from './address-routing.module';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddressComponent
  ],
  imports: [
    AddressRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule
  ],
  providers: []
})
export class AddressModule { }
