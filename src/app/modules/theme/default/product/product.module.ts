import { NgModule } from '@angular/core';
import { ProductRoutingModule } from './product-routing.module';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { CommentsComponent } from './comments/comments.component';
import { RelatedProductsComponent } from './related-products/related-products.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    ProductComponent,
    CommentsComponent,
    RelatedProductsComponent
  ],
  imports: [
    ProductRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    ModalModule.forRoot()
  ],
  providers: []
})
export class ProductModule { } 