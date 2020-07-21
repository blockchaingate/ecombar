import { NgModule } from '@angular/core';
import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantComponent } from './merchant.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { NavComponent } from './layout/nav/nav.component';

@NgModule({
  declarations: [
    MerchantComponent,
    FooterComponent,
    HeaderComponent,
    NavComponent
  ],
  imports: [
    MerchantRoutingModule
  ],
  providers: []
})
export class MerchantModule { }
