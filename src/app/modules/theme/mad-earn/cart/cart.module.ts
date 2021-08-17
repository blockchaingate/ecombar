import { NgModule } from '@angular/core';
import { CartRoutingModule } from './cart-routing.module';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

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
    NgxSmartModalModule.forRoot()
  ],
  exports: [
    CartComponent
  ],
  providers: []
})
export class CartModule { }
