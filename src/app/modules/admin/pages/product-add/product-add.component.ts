import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { TextLanService } from '../../../shared/services/textlan.service';
import { CategoryService } from '../../../shared/services/category.service';
import { BrandService } from '../../../shared/services/brand.service';
import { currencies } from '../../../../../environments/currencies';
import { Product } from '../../../shared/models/product';
import { TextLan } from '../../../shared/models/textlan';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, ImageSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-admin-product-add',
  providers: [ProductService, CategoryService, ToolbarService, LinkService, ImageService, HtmlEditorService],
  templateUrl: './product-add.component.html',
  styleUrls: [
    './product-add.component.scss',
    '../../../../../select.scss',
    '../../../../../card.scss',
    '../../../../../button.scss'
  ]
})
export class ProductAddComponent implements OnInit {

  public insertImageSettings :ImageSettingsModel = { allowedTypes: ['.jpeg', '.jpg', '.png'], display: 'inline', width: 'auto', height: 'auto', saveFormat: 'Blob', saveUrl: null, path: null,}

  title: string;
  price: string;
  product: any;
  active: boolean;
  id: string;
  currentTab: string;
  category: string;
  categories: any;
  brand: string;
  brands: any;
  currencies: any;
  images: any;
  currency: string;
  description: string;
  titleChinese: string;
  descriptionChinese: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private textlanServ: TextLanService,
    private categoryServ: CategoryService,
    private brandServ: BrandService,
    private productServ: ProductService) {
  }

  ngOnInit() {
    this.active = false;
    this.descriptionChinese = '';
    this.images = [
      'https://img1.cohimg.net/is/image/Coach/73995_b4lj_a0?fmt=jpg&wid=680&hei=885&bgc=f0f0f0&fit=vfit&qlt=75',
      'https://img1.cohimg.net/is/image/Coach/73995_b4lj_a3?fmt=jpg&wid=680&hei=885&bgc=f0f0f0&fit=vfit&qlt=75',
      'https://img1.cohimg.net/is/image/Coach/73995_b4lj_a8?fmt=jpg&wid=680&hei=885&bgc=f0f0f0&fit=vfit&qlt=75',
      'https://img1.cohimg.net/is/image/Coach/73995_b4lj_a97?fmt=jpg&wid=680&hei=885&bgc=f0f0f0&fit=vfit&qlt=75',
      'https://img1.cohimg.net/is/image/Coach/73995_a91?fmt=jpg&wid=680&hei=885&bgc=f0f0f0&fit=vfit&qlt=75'
    ];
    this.currentTab = 'default';
    this.currencies = currencies;
    this.categoryServ.getCategories().subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.categories = res._body;
        }
      }
    );

    this.brandServ.getBrands().subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.brands = res._body;
        }
      }      
    );

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.productServ.getProduct(this.id).subscribe(
        (res: any) => {
          console.log('ressssss=', res);
          if (res && res.ok) {
            const product = res._body;
            console.log('product=', product);
            this.product = product;
            if (product.title) {
              this.title = product.title.en;
              this.titleChinese = product.title.sc;
            }

            if (product.description) {
              this.description = product.description.en;
              if(product.description.sc) {
                this.descriptionChinese = product.description.sc;
              }
              
            }

            this.currency = product.currency;
            this.price = product.price;
            this.brand = product.brand;
            this.active = product.active;
            if (product.images) {
              this.images = product.images;
            }

            this.category = product.primaryCategoryId;


          }

        }
      );
    }
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  setActive(a: boolean) {
    this.active = a;
  }

  onUploaded(event) {
    this.images.push(event);
  }
  saveProduct() {
    console.log('this.images=', this.images);
    const titleLan: TextLan = { name: 'title', en: this.title, sc: this.titleChinese };
    const descLan: TextLan = { name: 'title', en: this.description, sc: this.descriptionChinese };
    const data: Product = {
      title: titleLan,
      description: descLan,
      price: parseInt(this.price), // in cents
      currency: 'USD',
      primaryCategoryId: this.category,
      active: this.active,
      images: this.images,
      brand: this.brand
    };
    if (this.id) {
      this.productServ.update(this.id, data).subscribe(
        (res: any) => {
          console.log('res=', res);
          if (res.ok) {
            this.router.navigate(['/admin/products']);
          }
        }
      );
    } else {
      this.productServ.create(data).subscribe(
        (res: any) => {
          console.log('res=', res);
          if (res.ok) {
            this.router.navigate(['/admin/products']);
          }
        }
      );
    }

  }
}
