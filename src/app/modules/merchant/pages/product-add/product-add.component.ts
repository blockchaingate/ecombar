import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { UserService } from '../../../shared/services/user.service';
import { CategoryService } from '../../../shared/services/category.service';
import { BrandService } from '../../../shared/services/brand.service';
import { currencies } from '../../../../../environments/currencies';
import { TextLan } from '../../../shared/models/textlan';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, ImageSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';
import { LocalStorage } from '@ngx-pwa/local-storage';
//import { NgxSmartModalService } from 'ngx-smart-modal';
import { UtilService } from '../../../shared/services/util.service';
import { IddockService } from '../../../shared/services/iddock.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import BigNumber from 'bignumber.js/bignumber';


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

  smartContractAddress: string;
  wallets: any;
  wallet: any;
  features: any;
  feature: string;
  walletAddress: string;
  featureChinese: string;
  featuresChinese: any;
  title: string;
  subtitle: string;
  price: string;
  product: any;
  keywords: any;
  keyword: string;
  active: boolean;
  contents: any;
  noWallet: boolean;
  id: string;
  modalRef: BsModalRef;
  password: string;
  color: string;
  objectId: string;
  colors: any;
  currentTab: string;
  category: string;
  categories: any;
  brand: string;
  brands: any;
  defaultColors: any;
  specName: string;
  specValue: string;
  currencies: any;
  images: any;
  contentName: string;
  contentQuantity: number;
  merchantId: string;
  currency: string;
  description: string;
  titleChinese: string;
  subtitleChinese: string;
  descriptionChinese: string;
  detail: string;
  specs: any;
  specsChinese: any;
  specification: string;
  detailChinese: string;
  specificationChinese: string;  
  constructor(
    private toastrServ: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private dataServ: DataService,
    private iddockServ: IddockService,
    private modalService: BsModalService,
    //private ngxSmartModalServ: NgxSmartModalService,
    private localSt: LocalStorage,
    private userServ: UserService,
    private categoryServ: CategoryService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private brandServ: BrandService,
    private utilServ: UtilService,
    private productServ: ProductService) {
  }

  ngOnInit() {
    this.defaultColors = [
      'black',
      'white',
      'green',
      'brown'
    ];
    this.contentQuantity = 0;
    this.contents = [];
    this.colors = [];
    this.specs = [];
    this.keywords = [];
    this.features = [];
    this.featuresChinese = [];
    this.title = '';
    this.subtitle = '';
    this.titleChinese = '';
    this.subtitleChinese = '';
    this.detail = '';
    this.category = '';
    this.brand = '';
    this.detailChinese = '';
    this.description = '';
    this.descriptionChinese = '';
    this.active = true;
    this.noWallet = false;
    this.images = [

    ];
    this.currentTab = 'default';
    this.currencies = currencies;

    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
      }
    );  
    
    this.dataServ.currentStore.subscribe(
      (store: any) => {
        if(store) {
          this.smartContractAddress = store.smartContractAddress;
        }
      }
    );
    /*
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
    */



    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.productServ.getProduct(this.id).subscribe(
        (res: any) => {
          if (res && res.ok) {
            const product = res._body;
            this.product = product;
            if (product.title) {
              this.title = product.title.en;
              this.titleChinese = product.title.sc;
            }
            if (product.subtitle) {
              this.subtitle = product.subtitle.en;
              this.subtitleChinese = product.subtitle.sc;
            }
            if (product.description) {
              this.description = product.description.en;
              if(product.description.sc) {
                this.descriptionChinese = product.description.sc;
              }
            }

            if(product.keywords) {
              this.keywords = product.keywords;

            }
            if (product.briefIntroduction) {
              this.detail = product.briefIntroduction.en;
              if(product.briefIntroduction.sc) {
                this.detailChinese = product.briefIntroduction.sc;
              }
            }

            if (product.specs) {
              this.specs = product.specs.en[0].details;
              console.log('this.specs=', this.specs);
              if(product.specs.sc) {
                this.specsChinese = product.specs.sc[0].details;
              }
            }
 
            if(product.features) {
              this.features = product.features.en;
              if(product.features.sc) {
                this.featuresChinese = product.features.sc;
              }              
            }

            if(product.contents) {
              this.contents = product.contents;
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

  addKeyword() {
    this.keywords.push(this.keyword);
    this.keyword = '';
  }

  removeKeyword(k) {
    this.keywords = this.keywords.filter(item => item != k);
  }


  createWallet() {
    this.router.navigate(['/wallet/create-wallet']);
  }

  importWallet() {
    this.router.navigate(['/wallet/import-wallet']);
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

  addContent() {
    if(!this.contentName || !this.contentQuantity) {
      return;
    }
    this.contents.push(
      {name: this.contentName, quantity:this.contentQuantity}
    );
    this.contentName = '';
    this.contentQuantity = 0;
  }

  removeContent(content) {
    this.contents = this.contents.filter(item => item.name != content.name && item.quantity != content.value);
  }  

  removeFeature(feature) {
    this.features = this.features.filter(item => item != feature);
  }

  saveProduct() {
    //this.ngxSmartModalServ.getModal('passwordModal').open();
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.saveProductDo(seed);
    });
  }

  /*
  onConfirmPassword(event) {
    
      this.ngxSmartModalServ.getModal('passwordModal').close();
      this.password = event;
      this.saveProductDo();
      
  }  
  */
  addFeature() {
    this.features.push(this.feature);
    this.feature = '';
  }
  
  async saveProductDo(seed: Buffer) {
    console.log('this.images=', this.images);
    //const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.password); 
    const titleLan: TextLan = { name: 'title', en: this.title, sc: this.titleChinese };
    const subtitleLan: TextLan = { name: 'subtitle', en: this.subtitle, sc: this.subtitleChinese };
    const featuresLan: TextLan = { name: 'features', en: this.features, sc: this.featuresChinese };
    const detailLan: TextLan = { name: 'detail', en: this.detail, sc: this.detailChinese };
    const descLan: TextLan = { name: 'description', en: this.description, sc: this.descriptionChinese };
    const specLan = { 
      en: 
      [{
        group: "",
        details:this.specs
      }], 
      sc: 
      [{ 
        group: "",
        details: this.specsChinese 
      }]
    };
    const data: any = {
      smartContractAddress: this.smartContractAddress,
      title: titleLan,
      subtitle: subtitleLan,
      briefIntroduction: detailLan,
      description: descLan,
      features:featuresLan,      
      specs: specLan,
      price: parseInt(this.price), // in cents
      currency: 'USD',
      keywords: this.keywords,
      contents: this.contents,
      primaryCategoryId: this.category ? this.category : null,
      active: this.active,
      images: this.images,
      colors: this.colors,
      brand: this.brand ? this.brand : null
    };
    
    //const datahash = this.iddockServ.getDataHash(data);
    //console.log('datahash==', datahash);

    if(!this.id) {
      (await this.iddockServ.addIdDock(seed, 'things', null, data, null)).subscribe( async res => {
        console.log('ress=', res);
        if(res) {
          if(res.ok) {
            console.log('res.body._id=', res._body._id);
            this.objectId = this.utilServ.sequenceId2ObjectId(res._body._id.substring(0, 60));
            data.objectId = this.objectId;
            //data.address = this.walletAddress;
            //console.log('this.objectId=', this.objectId);
            const abi = 	{
              "inputs": [
                {
                  "internalType": "bytes30",
                  "name": "objectId",
                  "type": "bytes30"
                },
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                }
              ],
              "name": "createProduct",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            };
            const args = ['0x' + res._body._id.substring(0, 60), new BigNumber(data.price).multipliedBy(new BigNumber(1e18)).toFixed()];
            console.log('args===', args);
            const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.smartContractAddress, abi, args);
            console.log('rettt=', ret);
            this.productServ.create(data).subscribe(
              (res: any) => {
                this.router.navigate(['/merchant/products']);
              }
            );
          } else {
            this.toastrServ.error('add to id dock error');
          }
          
        }
      });      
    } else {
      this.productServ.update(this.id, data).subscribe(
        async (res: any) => {
          console.log('res=', res);
          if (res.ok) {
            (await this.iddockServ.updateIdDock(seed, this.product.objectId, 'things', null, data, null)).subscribe(res => {
              if(res) {
                if(res.ok) {
                  this.router.navigate(['/merchant/products']);
                }
              }
            });            
          }
        }
      );      
    }
    /*
    const dataInIddock = {
      title: titleLan,
      briefIntroduction: detailLan,
      description: descLan,
      features: featuresLan,
      specs: specLan,
      keywords: this.keywords,
      contents: this.contents,
      price: parseInt(this.price), // in cents
      currency: 'USD',
      primaryCategory: (this.categories && this.category) ? this.categories.filter(item => item._id === this.category)[0] : null,
      active: this.active,
      images: this.images,
      colors: this.colors,
      brand: (this.brands && this.brand) ? this.brands.filter(item => item._id === this.brand)[0]  : null   
    }

    console.log('dataaaaaa=', data);
    if (this.id) {


      this.productServ.update(this.id, data).subscribe(
        async (res: any) => {
          console.log('res=', res);
          if (res.ok) {
            (await this.iddockServ.updateIdDock(seed, this.product.objectId, 'things', null, dataInIddock, null)).subscribe(res => {
              if(res) {
                if(res.ok) {
                  this.router.navigate(['/admin/products']);
                }
              }
            });            
          }
        }
      );
    } else {
         

      //const nonce = 0;
      //const id = (this.type == 'people' ? this.walletAddress : this.rfid);

      (await this.iddockServ.addIdDock(seed, 'things', null, dataInIddock, null)).subscribe(res => {
        console.log('ress=', res);
        if(res) {
          if(res.ok) {
            console.log('res.body._id=', res._body._id);
            this.objectId = this.utilServ.sequenceId2ObjectId(res._body._id.substring(0, 60));
            data.objectId = this.objectId;
            console.log('this.objectId=', this.objectId);
            this.productServ.create(data).subscribe(
              (res: any) => {
                console.log('res=', res);
                if (res.ok) {
                  this.router.navigate(['/admin/products']);
                } else {
                  this.toastrServ.error('add to database error');
                }
              }
            );
          } else {
            this.toastrServ.error('add to id dock error');
          }
          
        }
      });


    }
    */
  }
}
