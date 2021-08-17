import { NgModule } from '@angular/core';
import {StoreRoutingModule } from './store-routing.module';
import { CommonModule } from '@angular/common';
import { StoreComponent } from './store.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { IndexModule } from '../index/index.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    StoreComponent
  ],
  imports: [
    StoreRoutingModule,
    CommonModule,
    FormsModule,
    IndexModule,
    SharedModule
  ],
  providers: []
})
export class StoreModule { }