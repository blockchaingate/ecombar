import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../shared/services/collection.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { ProductService } from '../../../shared/services/product.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MerchantService } from '../../../shared/services/merchant.service';

@Component({
  selector: 'app-admin-collection-add',
  providers: [CollectionService],
  templateUrl: './collection-add.component.html',
  styleUrls: ['./collection-add.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class CollectionAddComponent implements OnInit {
  products: any;
  productId: string;
  collectionProducts: any;
  sequence: number;
  name: string;
  nameChinese: string;
  currentTab: string;
  id: string;

  constructor(
    private productServ: ProductService,
    private userServ: UserService,
    private authServ: AuthService,
    private merchantServ: MerchantService,
    private route: ActivatedRoute,
    private router: Router,
    private collectionServ: CollectionService) {

  }

  ngOnInit() {
    this.products = [];
    this.collectionProducts = [];
    this.productId = '';
    this.currentTab = 'default';
    this.getProducts();

    this.id = this.route.snapshot.paramMap.get('id');
    console.log('this.id====', this.id);
    if (this.id) {
      this.collectionServ.getCollection(this.id).subscribe(
        (res: any) => {
          console.log('ressssss=', res);
          if (res && res.ok) {
            const collection = res._body;
            console.log('collection=', collection);
            this.name = collection.name.en;
            this.nameChinese = collection.name.sc;
            this.collectionProducts = collection.products;
            this.sequence = collection.sequence;
          }

        }
      );
    }
  }

  addProduct() {
    console.log('this.productId==', this.productId);
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];
      if (product._id == this.productId) {
        this.collectionProducts.push(product);
        break;
      }
    }
  }

  deleteProduct(product) {
    this.collectionProducts = this.collectionProducts.filter(
      item => item._id != product._id
    );
  }
  
  getProducts() {
    const merchantId = this.merchantServ.id;

    if (this.userServ.isSystemAdmin) {
      this.productServ.getProducts().subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.products = res._body;
            console.log('this.products===', this.products);
          }
        }
      );
    } else
      if (merchantId) {
        this.productServ.getMerchantProducts(merchantId).subscribe(
          (res: any) => {
            if (res && res.ok) {
              this.products = res._body;
            }
          }
        );
      }
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  addCollection() {
    const products = [];
    console.log('this.images2');
    if (this.collectionProducts) {
      for (let i = 0; i < this.collectionProducts.length; i++) {
        products.push(this.collectionProducts[i]._id);
      }
    }
    const data = {
      name: {
        en: this.name,
        sc: this.nameChinese
      },
      sequence: this.sequence,
      products: products
    };
    if (!this.id) {

      this.collectionServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/admin/collections']);
          }
        }
      );
    } else {
      this.collectionServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/admin/collections']);
          }
        }
      );
    }

  }
}
