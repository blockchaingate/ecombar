import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddressRoutingModule } from './address-routing.module';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    AddressComponent
  ],
  imports: [
    AddressRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  // Fix: No provider for ControlContainer found
    SharedModule,
    NgxSpinnerModule,
    ModalModule.forRoot()
  ],
  providers: []
})
export class AddressModule { }
