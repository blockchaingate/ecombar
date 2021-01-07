import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HeaderComponent } from './layout/header/header.component';
import { MenuMobileComponent } from './layout/header/menu-mobile/menu-mobile.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { Category2Component } from './category2/category2.component';
// import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    Category2Component,
    MenuMobileComponent,
  ],
  imports: [
    // QRCodeModule,
    HomeRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule
  ],
  providers: []
})
export class HomeModule { }
