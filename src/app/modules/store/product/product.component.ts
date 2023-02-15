import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';
import { CartItem } from 'src/app/modules/shared/models/cart-item';
import { Router } from '@angular/router';
import { TranslateService } from 'src/app/modules/shared/services/translate.service';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { CommentService } from 'src/app/modules/shared/services/comment.service';
import { FavoriteService } from 'src/app/modules/shared/services/favorite.service';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CoinService } from '../../shared/services/coin.service';
import { IddockService } from '../../shared/services/iddock.service';
import { KanbanSmartContractService } from '../../shared/services/kanban.smartcontract.service';

@Component({
  template:''
})
export class ProductComponent implements OnInit {
  modalRef: BsModalRef;
  product: any;
  comments: any;
  id: string;
  parentId: string;
  productObjectIds: any;
  currency: string;
  quantity: number;
  store: any;
  colors: any;
  colorsChinese: any;
  sizes: any;
  smartContractAddress: string;
  quantities: any;
  sizesChinese: any;
  taxRate: number;
  relatedProducts: any;
  total: number;
  tax: number;
  favorite: any;
  isFavorited: boolean;
  token: any;
  lang: string;
  colorChinese: string;
  sizeChinese: string;
  color: string;
  size: string;
  storeId: string;
  overall: number;
  rating5: number;
  rating4: number;
  rating3: number;
  rating2: number;
  rating1: number;
  wallet: any;
  NavTab: string;    // 导航 Tab
  currentTab: string;    // 语言 Tab

  selectedImage: string;
  constructor(
    private coinServ: CoinService,
    private dataServ: DataService,
    private cartStoreServ: CartStoreService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private web3Serv: Web3Service,
    private productServ: ProductService,
    private favoriteServ: FavoriteService,
    private orderServ: OrderService,
    private commentServ: CommentService,
    private utilServ: UtilService,
    private kanbanServ: KanbanService,
    private router: Router,
    private modalService: BsModalService,
    private storage: StorageService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private authServ: AuthService,
    private iddockServ: IddockService,
    private translateServ: TranslateService    
    ) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.lang = this.translateServ.getLang();
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );
    this.dataServ.currentStore.subscribe(
      (store: any) => {
        this.store = store;
        this.storeId = store._id;
        this.currency = store.coin;
        this.smartContractAddress = store.smartContractAddress;
        this.taxRate = store.taxRate;
      }
    );
    
    this.isFavorited = false;
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.favoriteServ.isMyFavorite(this.id, walletAddress).subscribe(
            (ret: any) => {
              if(ret && ret.ok) {
                this.isFavorited = ret._body;
              }
            }
          );
        }
      }
    );

    this.overall = 0;
    this.rating1 = 0;
    this.rating2 = 0;
    this.rating3 = 0;
    this.rating4 = 0;
    this.rating5 = 0;

    this.productServ.getRelatedProducts(this.id).subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.relatedProducts = res._body;
          console.log('this.relatedProducts=', this.relatedProducts);

        }
      }
    );

    this.commentServ.getComments(this.id).subscribe(
        (res: any) => {
            if(res && res.ok) {
                this.comments = res._body;
                console.log('this.comments=', this.comments);
                for(let i=0;i<this.comments.length;i++) {
                    const comment = this.comments[i];
                    const rating = comment.rating;
                    this.overall += rating;
                    if(rating == 1) {
                        this.rating1 += 1;
                    } else
                    if(rating == 2) {
                        this.rating2 += 1;
                    } else
                    if(rating == 3) {
                        this.rating3 += 1;
                    } else
                    if(rating == 4) {
                        this.rating4 += 1;
                    } else
                    if(rating == 5) {
                        this.rating5 += 1;
                    }                                   
                }
                if(this.comments.length > 0) {
                    this.overall /= this.comments.length;
                }
            }
        }
    );

    this.quantity = 1;

    this.commentServ.getComments(this.id).subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.comments = res._body;
          console.log('this.comments=', this.comments);
        }
      }
    );
    this.productServ.getProduct(this.id).subscribe(
      (res: any) => {
        if(res && res) {
          this.product = res;
          if(this.product.colors) {
            if(this.product.colors.en) {
              this.colors = this.product.colors.en;
            }
            if(this.product.colors.sc) {
              this.colorsChinese = this.product.colors.sc;
            }
          }
          
          if(this.product.sizes) {
            if(this.product.sizes.en) {
              this.sizes = this.product.sizes.en;
            }
            if(this.product.sizes.sc) {
              this.sizesChinese = this.product.sizes.sc;
            }
          }

          this.selectedImage = this.product.images[0];

        }
      }
    );

    this.NavTab = 'Description';    // 缺省页面
    this.currentTab = 'default';    // 缺省页面

  }

  changeNavTab(tabName: string) {
    this.NavTab = tabName;
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  decQuantity() {
    if(this.quantity > 1) {
      this.quantity --;
    }
    
  }

  incQuantity() {
    this.quantity ++;
  }

  mouseEnter(image) {
      this.selectedImage = image;
  }


  toggleFavorite(id) {
    this.parentId = id;
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
      if(this.isFavorited) {
        this.removeFromFavoriteDo(privateKey);
      } else {
        this.addToFavoriteDo(privateKey);
      }
      
    });
  }

  removeFromFavoriteDo(privateKey: any) {
    const data = {
      parentId: this.parentId
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;   

    this.favoriteServ.deleteFavorite(data).subscribe(
      (res: any) => {
        if(res&&res.ok) {
          this.isFavorited = false;
        }
      }
    );
  }

  addToFavoriteDo(privateKey: any) {
    const data = {
      parentId: this.parentId,
      store: this.storeId   
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature; 
    this.favoriteServ.create(data).subscribe(
      (res) => {
        if(res && res.ok) {
          this.toastr.success('add to favorite successfully', '');
          this.favorite = res._body;
          this.isFavorited = true;
        }
      }
    );
  }

  onAddToFavorite(event) {
    this.toggleFavorite(event);
  }

  onAddToCart(event) {
    console.log('event in onAddToCart=', event);
    this.addToCart(event.product, event.quantity);
  }

  removeFromFavorite() {
    if(!this.favorite) {
      return;
    }
    this.favoriteServ.deleteFavorite(this.favorite._id).subscribe(
      (res) => {
        if(res && res.ok) {
          this.toastr.success('remove from favorite successfully', '');
          this.favorite = null;
        }
      }      
    );
  }

  addToCart(product: any, quantity: number) {
    if(!Number(quantity)) {
        return;
    }
    const cartItem: CartItem = {
        productId: product._id,
        objectId: product.objectId,
        title: this.translateServ.transField(product.title),
        price: product.price,
        storeId: this.storeId,
        size: this.lang == 'en' ? this.size : this.sizeChinese,
        color: this.lang == 'en' ? this.color : this.colorChinese,
        currency: product.currency,
        rebateRate: product.rebateRate ? product.rebateRate : this.store.rebateRate,
        taxRate: product.taxRate ? product.taxRate : this.store.taxRate,
        lockedDays: product.lockedDays ? product.lockedDays : this.store.lockedDays,

        thumbnailUrl: product.images ? product.images[0] : null,
        quantity: Number(quantity)
      };
      this.cartStoreServ.addCartItem(cartItem);
  }

  async buyDo(seed) {
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;

    const items: CartItem[] = [];
    this.productObjectIds = [];
    this.quantities = [this.quantity];
    const item = {
      productId: this.product._id,
      objectId: this.product.objectId,
      storeId: this.storeId,
      currency: this.product.currency,
      quantity: Number(this.quantity),
      price: this.product.price,
      rebateRate: this.product.rebateRate ? this.product.rebateRate : this.store.rebateRate,
      taxRate: this.product.taxRate ? this.product.taxRate : this.store.taxRate,
      lockedDays: this.product.lockedDays ? this.product.lockedDays : this.store.lockedDays,
      size: this.lang == 'en' ? this.size : this.sizeChinese,
      color: this.lang == 'en' ? this.color : this.colorChinese,
      thumbnailUrl: this.product.images ? this.product.images[0] : null,
      title: this.translateServ.transField(this.product.title)
    }

    items.push(item);

    const orderData = { 
      merchantId: this.product.merchantId, 
      items: items, 
      currency:this.product.currency, 
      transAmount: this.product.price * Number(this.quantity)
    };





    (await this.iddockServ.addIdDock(seed, 'things', null, orderData, null)).subscribe( async res => {
      if(res) {
        if(res.ok) {
          console.log('res._body=', res._body);
          const objectId = this.utilServ.sequenceId2ObjectId(res._body._id.substring(0, 60));
          orderData['objectId'] = objectId; 

              const sig = this.kanbanServ.signJsonData(privateKey, orderData);
              orderData['sig'] = sig.signature;    
              this.orderServ.create2(orderData).subscribe(
                (res: any) => {
                  console.log('ress from create order', res);
                  if (res && res.ok) {
                    const body = res._body;
                    const orderID = body._id;
                    this.cartStoreServ.empty();

                    this.router.navigate(['/store/' + this.storeId + '/address/' + orderID]);
                  }
                }
              );
          }
      }
    });





  }

  buyNow(product: any, quantity: number) {
    if(!Number(quantity)) {
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
      this.buyDo(seed);
    });

  }
}
