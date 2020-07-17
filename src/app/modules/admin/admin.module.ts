import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
@NgModule({
  declarations: [
    AdminComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    AdminRoutingModule
  ],
  providers: []
})
export class AdminModule { }
