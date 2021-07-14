import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { StoresRoutingModule } from './stores-routing.module';
import { StoresComponent } from './stores.component';
import { StoresIndexComponent } from './components/index/index.component';



@NgModule({
  declarations: [StoresComponent, StoresIndexComponent],
  imports: [
    CommonModule,
    StoresRoutingModule,
    SharedModule,
    RouterModule,
    ModalModule.forRoot()
  ]
})
export class StoresModule { }
