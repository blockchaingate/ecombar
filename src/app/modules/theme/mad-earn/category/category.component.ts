import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  products: any;
  id: string;

  constructor(private route: ActivatedRoute, private productServ: ProductService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.productServ.getCategoryProducts(this.id).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.products = res._body;
        }
      });
  }
}
