import { NgModule } from '@angular/core';
import { ProductRoutingModule } from './product-routing.module';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { CommentsComponent } from './comments/comments.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductComponent,
    CommentsComponent
  ],
  imports: [
    ProductRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule
  ],
  providers: []
})
export class ProductModule { } 