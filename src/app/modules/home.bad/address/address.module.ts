import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddressRoutingModule } from './address-routing.module';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxSpinnerModule } from "ngx-bootstrap-spinner";

@NgModule({
  declarations: [
    AddressComponent
  ],
  imports: [
    AddressRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    NgxSpinnerModule,
    NgxSmartModalModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: []
})
export class AddressModule { }
