import { NgModule } from '@angular/core';
import {StoreRoutingModule } from './store-routing.module';
import { CommonModule } from '@angular/common';
import { StoreComponent } from './store.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    StoreComponent
  ],
  imports: [
    StoreRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule
  ],
  providers: []
})
export class StoreModule { }