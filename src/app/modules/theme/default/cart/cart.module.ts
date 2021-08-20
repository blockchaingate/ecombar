import { NgModule } from '@angular/core';
import { CartRoutingModule } from './cart-routing.module';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule } from '@angular/forms';
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
    ModalModule.forRoot()
  ],
  exports: [
    CartComponent
  ],
  providers: []
})
export class CartModule { }
