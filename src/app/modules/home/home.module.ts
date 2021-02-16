import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HeaderComponent } from './layout/header/header.component';
import { MenuMobileComponent } from './layout/header/menu-mobile/menu-mobile.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { Category2Component } from './category2/category2.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ApplyForMerchantComponent } from './apply-for-merchant/apply-for-merchant.component';
import { ProductItemOneComponent } from './components/product-item-one/product-item-one.component';
import { ProductItemTwoComponent } from './components/product-item-two/product-item-two.component';
import { ProductItemThreeComponent } from './components/product-item-three/product-item-three.component';
import { ProductItemFourComponent } from './components/product-item-four/product-item-four.component';
import { CompareComponent } from './compare/compare.component';
// import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    Category2Component,
    ProductListComponent,
    MenuMobileComponent,
    ApplyForMerchantComponent,
    ProductItemOneComponent,
    ProductItemTwoComponent,
    ProductItemThreeComponent,
    ProductItemFourComponent,
    CompareComponent
  ],
  imports: [
    // QRCodeModule,
    HomeRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: []
})
export class HomeModule { }
