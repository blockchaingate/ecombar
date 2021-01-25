import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { UserService } from '../../../shared/services/user.service';
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
  color: string;
  colors: any;
  currentTab: string;
  category: string;
  categories: any;
  brand: string;
  brands: any;
  specName: string;
  specValue: string;
  currencies: any;
  images: any;
  merchantId: string;
  currency: string;
  description: string;
  titleChinese: string;
  descriptionChinese: string;
  detail: string;
  specs: any;
  specification: string;
  detailChinese: string;
  specificationChinese: string;  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userServ: UserService,
    private categoryServ: CategoryService,
    private brandServ: BrandService,
    private productServ: ProductService) {
  }

  ngOnInit() {
    this.colors = [];
    this.specs = [];
    this.active = true;
    this.descriptionChinese = '';
    this.images = [

    ];
    this.currentTab = 'default';
    this.currencies = currencies;

    this.userServ.getMe().subscribe(
      ret => {
        console.log('ret==', ret);
        if(ret && ret.ok) {
          const body = ret._body;
          this.merchantId = body.defaultMerchant._id;
          this.categoryServ.getCategories().subscribe(
            (res: any) => {
              if (res && res.ok) {
                this.categories = res._body;
                this.categories = this.categories.filter(item => !item.merchantId || item.merchantId == this.merchantId);
              }
            }
          );


          this.brandServ.getBrands().subscribe(
            (res: any) => {
              if (res && res.ok) {
                this.brands = res._body;
                this.brands = this.brands.filter(item => !item.merchantId || item.merchantId == this.merchantId);
                console.log('this.brands=', this.brands);
              }
            }      
          );          
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

            if (product.briefIntroduction) {
              this.detail = product.briefIntroduction.en;
              if(product.briefIntroduction.sc) {
                this.detailChinese = product.briefIntroduction.sc;
              }
            }

            if (product.specification) {
              this.specification = product.specification.en;
              if(product.specification.sc) {
                this.specificationChinese = product.specification.sc;
              }
            }

            this.currency = product.currency;
            this.price = product.price;
            this.brand = product.brand;
            this.colors = product.colors;
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

  addColor() {
    this.colors.push(this.color);
    this.color = '';
  }

  removeColor(c) {
    this.colors = this.colors.filter(item => item != c);
  }

  addSpec() {
    if(!this.specName || !this.specValue) {
      return;
    }
    this.specs.push(
      {name: this.specName,value:this.specValue}
    );
    this.specName = '';
    this.specValue = '';
  }
  removeSpec(spec) {
    this.specs = this.specs.filter(item => item.name != spec.name && item.value != spec.value);
  }  
  saveProduct() {
    console.log('this.images=', this.images);
    const titleLan: TextLan = { name: 'title', en: this.title, sc: this.titleChinese };
    const detailLan: TextLan = { name: 'detail', en: this.detail, sc: this.detailChinese };
    const descLan: TextLan = { name: 'description', en: this.description, sc: this.descriptionChinese };
    //const specLan: TextLan = { name: 'specification', en: this.specification, sc: this.specificationChinese };
    const data: Product = {
      title: titleLan,
      briefIntroduction: detailLan,
      description: descLan,
      //specification: specLan,
      price: parseInt(this.price), // in cents
      currency: 'USD',
      primaryCategoryId: this.category,
      active: this.active,
      images: this.images,
      colors: this.colors,
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
