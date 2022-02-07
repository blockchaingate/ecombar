import { Component, OnInit } from '@angular/core';
import { ProductComponent as ParnetProductComponent } from 'src/app/modules/store/product/product.component';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends ParnetProductComponent{}
