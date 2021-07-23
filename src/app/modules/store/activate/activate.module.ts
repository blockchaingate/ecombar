import { NgModule } from '@angular/core';
import { ActivateRoutingModule } from './activate-routing.module';
import { CommonModule } from '@angular/common';
import { ActivateComponent } from './activate.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ActivateComponent
  ],
  imports: [
    ActivateRoutingModule,
    CommonModule,
    SharedModule
  ],
  providers: []
})
export class ActivateModule { }