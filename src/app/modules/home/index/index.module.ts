import { NgModule } from '@angular/core';
import { IndexRoutingModule } from './index-routing.module';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index.component';
import { SlideShowComponent } from './components/slide-show/slide-show.component';

@NgModule({
  declarations: [
    IndexComponent,
    SlideShowComponent
  ],
  imports: [
    IndexRoutingModule,
    CommonModule
  ],
  providers: []
})
export class IndexModule { }
