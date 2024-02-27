import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { Router } from '@angular/router';
import { TranslateService } from 'src/app/modules/shared/services/translate.service';
import { CartItem, CartItemForSmartContract } from 'src/app/modules/shared/models/cart-item';
import { groupBy } from 'src/app/modules/shared/utils/array-tool';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { IddockService } from 'src/app/modules/shared/services/iddock.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import BigNumber from 'bignumber.js';
import { CoinService } from 'src/app/modules/shared/services/coin.service';

@Component({
  template: ''
})
export class CartComponent implements OnInit, OnDestroy {
  interval;
  cartItems: CartItem[] = [];
  productObjectIds: string[] = [];
  quantities: number[] = [];
  payLink: string;
  @Input() noPadding: boolean;
  Total: { currency: string, total: string }[];
  paidConfirmed: boolean;
  txid: string;
  noWallet: boolean;
  storeOwner: string;
  payQrcode: string;
  storeId: string;
  merchantId: string;
  store: any;
  currency: string;
  walletAddress: string;
  txid_link: string;
  total: number;
  tax: number;
  taxRate: number;
  wallets: any;
  wallet: any;
  modalRef: BsModalRef;
  trans_code: string;
  smartContractAddress: string;
  errMsg = '';

  constructor(
    private modalService: BsModalService,
    private utilServ: UtilService,
    private cartStoreServ: CartStoreService,
    private orderServ: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private dataServ: DataService,
    private iddockServ: IddockService,
    private translateServ: TranslateService,
    private coinServ: CoinService,
    private kanbanServ: KanbanService,
    private kanbanSmartContractServ: KanbanSmartContractService
  ) {
  }

  calculateTotal(): void {
    this.total = 0;

    for(let i = 0; i < this.cartItems.length; i++) {
      const item = this.cartItems[i];
      const value = item.price * item.quantity;
      this.total += Number(value.toFixed(2));
    }

    this.tax = this.total * this.taxRate / 100;
  }

  ngOnInit(): void {

    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        if(wallet) {
          this.wallet = wallet;
        }
      }
    );

    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: any) => {
        if(walletAddress) {
          this.walletAddress = walletAddress;
        }
      }
    );

    this.dataServ.currentStore.subscribe(
      (store: any) => {
        if(store) {
          this.currency = store.coin;
          this.storeId = store._id;  // 返回“商家页” products-grid
          this.merchantId = store.id;  // 小心名字看错
          this.taxRate = store.taxRate;
          this.storeOwner = store.owner;
          const storedCart = this.cartStoreServ.items;
          this.cartItems = storedCart ? storedCart.filter((item) => item.storeId == this.merchantId) : [];  // Fix: this.storeId 用错
          this.calculateTotal();
        }

      }
    );



  }

  checkout() {
    if (this.total <= 0) {  // Fix: 价格为 0 处理
      return;
    }
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };        

    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.spinner.show();
      this.checkoutDo(seed);
    });
  }



  async checkoutDo(seed: Buffer) {
    const items: CartItem[] = [];
    this.quantities = [];
 

    
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;
    
    this.cartItems.forEach(item => {
      console.log('item=', item);
      this.quantities.push(item.quantity);

      const titleTran = this.translateServ.transField(item.title);
      item.title = titleTran ? titleTran : item.title;
      items.push(item);
    });
    let currency = this.currency;
    const orderData = { merchantId: this.merchantId, owner: this.walletAddress, items, currency };

    /*
        owner: { type: String},
    totalAmount: {type: Number},
    totalTax: {type: Number},
    totalShipping: {type: Number},
    currency: {type: String, required: true},
    merchantId: {type: String, required: true},
    items: [{
        title: String,
        taxRate: Number,
        lockedDays: Number,
        rebateRate: Number,
        price: Number,
        quantity: Number
    }], 
    */
    const sig = this.kanbanServ.signJsonData(privateKey, orderData);
    orderData['sig'] = sig.signature;  
    this.orderServ.create2(orderData).subscribe(
      (res: any) => {
        if (res) {
          const body = res;
          const orderID = body._id;
          this.spinner.hide();
          this.cartStoreServ.empty();
          this.router.navigate(['/store/' + this.storeId + '/address/' + orderID]);
        }
      },
      err => { 
        this.errMsg = err.message;
        this.spinner.hide();
        this.toastr.error('error while creating order');              
       }
    );  

    /*
    (await this.iddockServ.addIdDock(seed, 'things', null, orderData, null)).subscribe( async res => {
      if(res) {
        if(res.ok) {
          console.log('res._body=', res._body);
          const objectId = this.utilServ.sequenceId2ObjectId(res._body._id.substring(0, 60));
          orderData['objectId'] = objectId; 
          const sig = this.kanbanServ.signJsonData(privateKey, orderData);
          orderData['sig'] = sig.signature;               

        
        }
        else {
          this.spinner.hide();
          this.toastr.error('error while saving to iddock');
        }
      }});
      */


  }

  clear() {
    this.cartItems = [];
    this.cartStoreServ.empty();
  }

  updateProduct(item) {
    console.log('this.images3');
    const product = item.product;
    const quantity = item.quantity;
    const productId = product.productId;
    if (quantity === 0) {
      this.cartItems = this.cartItems.filter((itm) => itm.productId !== productId);
    } else {
      for (let i = 0; i < this.cartItems.length; i++) {
        if (this.cartItems[i].productId === productId) {
          this.cartItems[i].quantity = quantity;
        }
      }
    }
    this.cartStoreServ.saveCartItems(this.cartItems);
    this.calculateTotal();
  }

  pauseTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

  }

  calcTotal() {
    return this.cartItems.reduce(
      (acc, prod) => acc += prod.quantity, 0
    );
  }

  ngOnDestroy(): void {
    this.pauseTimer();
  }
}
