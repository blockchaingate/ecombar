import { NgModule } from '@angular/core';
import { IndexRoutingModule } from './index-routing.module';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index.component';
import { SlideShowComponent } from './components/slide-show/slide-show.component';
import { CollectionsComponent } from './components/collections/collections.component';
import { Collections2Component } from './components/collections2/collections2.component';
import { TopCategoriesComponent } from './components/top-categories/top-categories.component';
import { InfoBarComponent } from './components/info-bar/info-bar.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ProductCardComponent } from './components/product-card/product-card.component';

@NgModule({
  declarations: [
    IndexComponent,
    SlideShowComponent,
    CollectionsComponent,
    Collections2Component,
    InfoBarComponent,
    TopCategoriesComponent,
    ProductCardComponent

  ],
  imports: [
    IndexRoutingModule,
    CommonModule,
    SharedModule
  ],
  exports: [
    CollectionsComponent,
    Collections2Component,
    TopCategoriesComponent
  ],
  providers: []
})
export class IndexModule { }
