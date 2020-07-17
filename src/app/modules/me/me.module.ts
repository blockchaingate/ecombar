import { NgModule } from '@angular/core';
import { MeRoutingModule } from './me-routing.module';
import { MeComponent } from './me.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';

@NgModule({
  declarations: [
    MeComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    MeRoutingModule
  ],
  providers: []
})
export class MeModule { }
