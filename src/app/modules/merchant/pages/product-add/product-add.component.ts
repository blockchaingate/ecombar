import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { BrandService } from 'src/app/modules/shared/services/brand.service';
import { currencies } from '../../../../../environments/currencies';
import { TextLan } from 'src/app/modules/shared/models/textlan';
import {  ImageSettingsModel, RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { IddockService } from 'src/app/modules/shared/services/iddock.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import BigNumber from 'bignumber.js/bignumber';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-product-add',
  providers: [ProductService, CategoryService],
  templateUrl: './product-add.component.html',
  styleUrls: [
    './product-add.component.scss',
    '../../../../../card.scss',
    '../../../../../page.scss'
  ]
})
export class ProductAddComponent implements OnInit {


  public insertImageSettings :ImageSettingsModel;
  timestamp: any;
  smartContractAddress: string;
  wallets: any;
  taxRate: number;
  rebateRate: number;
  lockedDays: number;
  quantity: number;
  wallet: any;
  features: any;
  selectedCategory: any;
  feature: string;
  walletAddress: string;
  featureChinese: string;
  featuresChinese: any;

  featureTradition: string;
  featuresTradition: any;

  title: string;
  subtitle: string;
  price: string;
  colorChinese: string;
  priceChinese: string;
  sizeChinese: string;
  colorsChinese: any;
  sizesChinese: any;
  specNameChinese: string;
  specValueChinese: string;


  colorTradition: string;
  priceTradition: string;
  sizeTradition: string;
  colorsTradition: any;
  sizesTradition: any;
  specNameTradition: string;
  specValueTradition: string;
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
  sizes: any;
  size: string;
  NavTab: string;    // 导航 Tab
  currentTab: string;    // 语言 Tab
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

  titleTradition: string;
  subtitleTradition: string;
  descriptionTradition: string;

  detail: string;
  specs: any;
  specsChinese: any;
  specsTradition: any;
  specification: string;
  detailChinese: string;
  specificationChinese: string;  

  detailTradition: string;
  specificationTradition: string;  
  constructor(
    private toastrServ: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private dataServ: DataService,
    private iddockServ: IddockService,
    private modalService: BsModalService,
    //private ngxSmartModalServ: NgxSmartModalService,
    private spinner: NgxSpinnerService,
    private coinServ: CoinService,
    private categoryServ: CategoryService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private kanbanServ: KanbanService,
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
    this.lockedDays = 90;
    this.timestamp = Date.now();
    this.contentQuantity = 0;
    this.contents = [];
    this.colors = [];
    this.sizes = [];
    this.colorsChinese = [];
    this.sizesChinese = [];

    this.colorsTradition = [];
    this.sizesTradition = [];

    this.specs = [];
    this.keywords = [];
    this.features = [];
    this.featuresChinese = [];
    this.featuresTradition = [];
    this.title = '';
    this.subtitle = '';
    this.titleChinese = '';
    this.subtitleChinese = '';
    this.titleTradition = '';
    this.subtitleTradition = '';
    this.detail = '';
    this.category = '';
    this.brand = '';
    this.detailChinese = '';

    this.detailTradition = '';
    this.description = '';
    this.descriptionChinese = '';

    this.descriptionTradition = '';
    this.active = true;
    this.noWallet = false;
    this.images = [

    ];
    this.NavTab = 'General';    // 缺省页面
    this.currentTab = 'default English';    // 缺省页面
    this.currencies = currencies;

    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
        if(walletAddress) {
          this.categoryServ.getMerchantCategories(walletAddress, 100, 0).subscribe(
            (res: any) => {
              if (res) {  //  && res.ok
                this.categories = res;  // res._body
              }
            }
          );
        }
        this.insertImageSettings = { 
          allowedTypes: ['.jpeg', '.jpg', '.png'], 
          display: 'inline', 
          width: 'auto', 
          height: 'auto', 
        //saveFormat: 'Blob', 
          saveUrl: 'https://' + (environment.production ? 'api' : 'test') + '.blockchaingate.com/v2/s3/' + walletAddress + '/' + this.timestamp + '/UploadFiles', 
          path: "https://prodid.s3.ca-central-1.amazonaws.com/store/" + walletAddress + "/" + this.timestamp + "/"
        }
      }
    );  
    
    this.dataServ.currentMyStore.subscribe(
      (store: any) => {
        if(store) {
          this.smartContractAddress = store.smartContractAddress;
          this.currency = store.coin;
          this.lockedDays = store.lockedDays;
        }
      }
    );

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.productServ.getProduct(this.id).subscribe(
        (res: any) => {
          if (res) {
            const product = res;
            this.product = product;  // 看起来没用上
            if (product.title) {
              this.title = product.title.en;
              this.titleChinese = product.title.sc;
              this.titleTradition = product.title.tc;
            }
            if (product.subtitle) {
              this.subtitle = product.subtitle.en;
              this.subtitleChinese = product.subtitle.sc;
              this.subtitleTradition = product.subtitle.tc;
            }
            if (product.description) {
              this.description = product.description.en;
              if(product.description.sc) {
                this.descriptionChinese = product.description.sc;
              }
              if(product.description.tc) {
                this.descriptionTradition = product.description.tc;
              }
            }

            if(product.keywords) {
              this.keywords = product.keywords;
            }

            if(product.taxRate) {
              this.taxRate = product.taxRate;
            }
            if(product.rebateRate) {
              this.rebateRate = product.rebateRate;
            }
            if(product.lockedDays) {
              this.lockedDays = product.lockedDays;
            }

            if (product.briefIntroduction) {
              this.detail = product.briefIntroduction.en;
              if(product.briefIntroduction.sc) {
                this.detailChinese = product.briefIntroduction.sc;
              }

              if(product.briefIntroduction.tc) {
                this.detailTradition = product.briefIntroduction.tc;
              }
            }

            if (product.specs) {
              this.specs = product.specs.en[0].details;
              console.log('this.specs=', this.specs);
              if(product.specs.sc) {
                this.specsChinese = product.specs.sc[0].details;
              }

              if(product.specs.tc) {
                this.specsTradition = product.specs.tc[0].details;
              }
            }
 
            if(product.features) {
              this.features = product.features.en;
              if(product.features.sc) {
                this.featuresChinese = product.features.sc;
              }    
              
              if(product.features.tc) {
                this.featuresTradition = product.features.tc;
              } 
            }

            if(product.contents) {
              this.contents = product.contents;
            }

            if(product.primaryCategory && this.categories) {
              for (let i = 0; i < this.categories.length; i ++) {
                if (this.categories[i]._id == product.primaryCategory) {
                  this.selectedCategory = this.categories[i];
                  console.log('selectedCategory=', this.selectedCategory);
                }
              }
            }
            this.quantity = product.quantity;
            this.currency = product.currency;
            this.price = product.price;
            this.brand = product.brand;
            if(product.colors) {
              if(product.colors.en) {
                this.colors = product.colors.en;
              }
              if(product.colors.sc) {
                this.colorsChinese = product.colors.sc;
              }

              if(product.colors.tc) {
                this.colorsTradition = product.colors.tc;
              }
            }
            if(product.sizes) {
              if(product.sizes.en) {
                this.sizes = product.sizes.en;
              }
              if(product.sizes.sc) {
                this.sizesChinese = product.sizes.sc;
              }

              if(product.sizes.tc) {
                this.sizesTradition = product.sizes.tc;
              }
            }
            
            this.active = product.active;
            if (product.images) {
              this.images = product.images;
            }
            this.category = product.primaryCategory;  // primaryCategoryId
          }

        }
      );
    }
  }

  changeLockedDays(days: number) {
    this.lockedDays = days;
  }
  public addHeaders(args: any) {
    console.log('add headerssss');
    args.currentRequest.setRequestHeader('custom-header', 'Syncfusion');
  }

  changeNavTab(tabName: string) {
    this.NavTab = tabName;
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  changeSelectedCategory(cat: any) {
    this.selectedCategory = cat;
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

  addSize() {
    this.sizes.push(this.size);
    this.size = '';
  }

  removeSize(c) {
    this.sizes = this.sizes.filter(item => item != c);
  }





  addColorChinese() {
    this.colorsChinese.push(this.colorChinese);
    this.colorChinese = '';
  }

  removeColorChinese(c) {
    this.colorsChinese = this.colorsChinese.filter(item => item != c);
  }

  addSizeChinese() {
    this.sizesChinese.push(this.sizeChinese);
    this.sizeChinese = '';
  }

  removeSizeChinese(c) {
    this.sizesChinese = this.sizesChinese.filter(item => item != c);
  }




  addColorTradition() {
    this.colorsTradition.push(this.colorTradition);
    this.colorTradition = '';
  }

  removeColorTradition(c) {
    this.colorsTradition = this.colorsTradition.filter(item => item != c);
  }

  addSizeTradition() {
    this.sizesTradition.push(this.sizeTradition);
    this.sizeTradition = '';
  }

  removeSizeTradition(c) {
    this.sizesTradition = this.sizesTradition.filter(item => item != c);
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



  addSpecChinese() {
    if(!this.specNameChinese || !this.specValueChinese) {
      return;
    }
    this.specsChinese.push(
      {name: this.specNameChinese,value:this.specValueChinese}
    );
    this.specNameChinese = '';
    this.specValueChinese = '';
  }

  removeSpecChinese(spec) {
    this.specsChinese = this.specsChinese.filter(item => item.name != spec.name && item.value != spec.value);
  }  



  addSpecTradition() {
    if(!this.specNameTradition || !this.specValueTradition) {
      return;
    }
    this.specsTradition.push(
      {name: this.specNameTradition,value:this.specValueTradition}
    );
    this.specNameTradition = '';
    this.specValueTradition = '';
  }

  removeSpecTradition(spec) {
    this.specsTradition = this.specsTradition.filter(item => item.name != spec.name && item.value != spec.value);
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

  removeFeatureChinese(featureChinese) {
    this.featuresChinese = this.featuresChinese.filter(item => item != featureChinese);
  }

  removeFeatureTradition(featureTradition) {
    this.featuresTradition = this.featuresTradition.filter(item => item != featureTradition);
  }

  saveProduct() {
    //this.ngxSmartModalServ.getModal('passwordModal').open();
    if(!this.price || !Number(this.price)) {
      this.toastrServ.info('price should be filled properly');
      return;
    }
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.spinner.show();
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
  
  addFeatureChinese() {
    this.featuresChinese.push(this.featureChinese);
    this.featureChinese = '';
  }

  addFeatureTradition() {
    this.featuresTradition.push(this.featureTradition);
    this.featureTradition = '';
  }

  async saveProductDo(seed: Buffer) {
    //const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.password); 
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;

    const titleLan: TextLan = { name: 'title', en: this.title, sc: this.titleChinese, tc: this.titleTradition };
    const subtitleLan: TextLan = { name: 'subtitle', en: this.subtitle, sc: this.subtitleChinese, tc: this.subtitleTradition };
    const featuresLan: TextLan = { name: 'features', en: this.features, sc: this.featuresChinese, tc: this.featureTradition };
    const detailLan: TextLan = { name: 'detail', en: this.detail, sc: this.detailChinese, tc: this.detailTradition };
    const descLan: TextLan = { name: 'description', en: this.description, sc: this.descriptionChinese, tc: this.descriptionTradition };

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
      }],
      tc: 
      [{ 
        group: "",
        details: this.specsTradition 
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
      quantity: this.quantity,
      price: Number(this.price), 
      keywords: this.keywords,
      lockedDays: this.lockedDays,
      taxRate: this.taxRate,
      rebateRate: this.rebateRate,
      contents: this.contents,
      primaryCategory: this.selectedCategory ? this.selectedCategory._id : null,
      active: this.active,
      images: this.images,
      colors: {
        en: this.colors,
        sc: this.colorsChinese,
        tc: this.colorsTradition
      },
      sizes: {
        en: this.sizes,
        sc: this.sizesChinese,
        tc: this.sizesTradition
      },
      brand: this.brand ? this.brand : null
    };
    
    //const datahash = this.iddockServ.getDataHash(data);
    //console.log('datahash==', datahash);
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature; 
    if(!this.id) {   
      this.productServ.create(data).subscribe(
          (res: any) => {
            this.spinner.hide();
            this.router.navigate(['/merchant/products']);
          }
      );    
    } else {     
      this.productServ.update(this.id, data).subscribe(
        async (res: any) => {
          console.log('res=', res);
          this.spinner.hide();
          this.router.navigate(['/merchant/products']);
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
