import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../shared/services/collection.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { ProductService } from '../../../shared/services/product.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MerchantService } from '../../../shared/services/merchant.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin-collection-add',
  providers: [CollectionService],
  templateUrl: './collection-add.component.html',
  styleUrls: ['./collection-add.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class CollectionAddComponent implements OnInit {
  products: any;
  modalRef: BsModalRef;
  productId: string;
  collectionProducts: any;
  sequence: number;
  name: string;
  nameChinese: string;
  currentTab: string;
  wallet: any;
  id: string;

  constructor(
    private productServ: ProductService,
    private userServ: UserService,
    private authServ: AuthService,
    public kanbanServ: KanbanService,
    private dataServ: DataService,
    private modalService: BsModalService,
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
    this.dataServ.currentWallet.subscribe(
      (wallet: string) => {
        this.wallet = wallet;
      }
    ); 

    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.getMerchantProducts(walletAddress);
        }
      }
    );


    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.collectionServ.getCollection(this.id).subscribe(
        (res: any) => {
          if (res && res.ok) {
            const collection = res._body;
            this.name = collection.name.en;
            this.nameChinese = collection.name.sc;
            this.collectionProducts = collection.products;
            this.sequence = collection.sequence;
          }

        }
      );
    }
  }

  getMerchantProducts(walletAddress: string) {
    this.productServ.getProductsOwnedBy(walletAddress).subscribe(
      (res: any) => {
        if (res) {
          this.products = res;
        }
      }
    );  
  }

  addProduct() {
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
  


  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  addCollection() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
      this.addCollectionDo(privateKey);
    });      
  }

  addCollectionDo(privateKey: any) {
    const products = [];
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

    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    if (!this.id) {

      this.collectionServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/collections']);
          }
        }
      );
    } else {
      this.collectionServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/collections']);
          }
        }
      );
    }

  }
}
