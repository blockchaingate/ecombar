
import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    IonicModule,
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule, 
    ReactiveFormsModule,
    ModalModule.forRoot()
  ]
})
export class HomeModule { }
