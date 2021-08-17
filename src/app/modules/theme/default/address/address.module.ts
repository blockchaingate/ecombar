import { NgModule } from '@angular/core';
import { AddressRoutingModule } from './address-routing.module';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  declarations: [
    AddressComponent
  ],
  imports: [
    AddressRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    NgxSmartModalModule.forRoot()
  ],
  providers: []
})
export class AddressModule { }
