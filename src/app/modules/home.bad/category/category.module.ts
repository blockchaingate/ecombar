import { NgModule } from '@angular/core';
import { CategoryRoutingModule } from './category-routing.module';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CategoryRoutingModule,
    CommonModule,
    SharedModule
  ],
  providers: []
})
export class CategoryModule { }
