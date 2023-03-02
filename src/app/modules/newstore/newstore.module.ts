import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewstoreComponent } from './newstore.component';
import { StoresRoutingModule } from './newstore-routing.module';


@NgModule({
  declarations: [NewstoreComponent],
  imports: [
    CommonModule,
    StoresRoutingModule
  ]
})
export class NewstoreModule { }
