import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    FormsModule, 
    ReactiveFormsModule,
    ModalModule.forRoot()
  ]
})
export class StoresModule { }
