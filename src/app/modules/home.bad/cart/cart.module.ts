import { NgModule } from '@angular/core';
import { CartRoutingModule } from './cart-routing.module';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from "ngx-bootstrap-spinner";

@NgModule({
  declarations: [
    CartComponent,
    CartProductComponent
  ],
  imports: [
    CartRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    NgxSpinnerModule,
    NgxSmartModalModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [
    CartComponent
  ],
  providers: []
})
export class CartModule { }
