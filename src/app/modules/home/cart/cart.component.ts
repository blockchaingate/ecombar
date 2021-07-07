import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CartStoreService } from '../../shared/services/cart.store.service';
import { OrderService } from '../../shared/services/order.service';
import { Router } from '@angular/router';
import { TranslateService } from '../../shared/services/translate.service';
import { CartItem, CartItemForSmartContract } from '../../shared/models/cart-item';
import { groupBy } from '../../shared/utils/array-tool';
import { UtilService } from '../../shared/services/util.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { IddockService } from '../../shared/services/iddock.service';
import { DataService } from '../../shared/services/data.service';
import { PasswordModalComponent } from '../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from '../../shared/services/kanban.smartcontract.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', '../../../../button.scss']
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
  password: string;
  payQrcode: string;
  txid_link: string;
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
    private dataServ: DataService,
    private iddockServ: IddockService,
    private translateServ: TranslateService,
    private kanbanSmartContractServ: KanbanSmartContractService
  ) {
  }

  calculateTotal(): void {
    this.Total = [];

    const grouped = groupBy(this.cartItems, (cI: CartItem) => cI.currency);

    grouped.forEach((currencyGroup: CartItem[]) => {
      let value = 0;
      const final = currencyGroup.map((v: CartItem) => value += v.price * v.quantity);
      this.Total.push({ currency: currencyGroup[0].currency, total: value.toFixed(2) });
    });
  }

  ngOnInit(): void {

    /*
    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

      if(!wallets || !wallets.items || (wallets.items.length == 0)) {
        this.noWallet = true;
        return;
      }
      this.wallets = wallets;
      console.log('this.wallets==', this.wallets);
      this.wallet = this.wallets.items[this.wallets.currentIndex];
    });  
    */
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        if(wallet) {
          this.wallet = wallet;
        }
      }
    );

    this.dataServ.currentStore.subscribe(
      (store: any) => {
        this.smartContractAddress = store.smartContractAddress;
      }
    );
    const storedCart = this.cartStoreServ.items;
    this.cartItems = storedCart ? storedCart : [];
    this.calculateTotal();

    console.log("storedCart init!");
    
    this.cartItems.map((item,i)=>{
      console.log("item: ", i );
      
      console.log(item.title);
      
    })
    console.log("storedCart init end!");
  }

  checkout() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.checkoutDo(seed);
    });
  }



  async checkoutDo(seed: Buffer) {
    const items: CartItem[] = [];
    const merchantIds = [];
    this.productObjectIds = [];
    this.quantities = [];
    let currency = '';
    let transAmount = 0;

    this.cartItems.forEach(item => {
      console.log('item=', item);
      this.productObjectIds.push('0x' + this.utilServ.ObjectId2SequenceId(item.objectId));
      this.quantities.push(item.quantity);
      if(merchantIds.indexOf(item.merchantId) < 0) {
        merchantIds.push(item.merchantId);
      }
      currency = item.currency;
      transAmount += item.quantity * item.price;
      const titleTran = this.translateServ.transField(item.title);
      item.title = titleTran ? titleTran : item.title;
      items.push(item);
    });
    const orderData = { merchantIds, items, currency, transAmount };


    (await this.iddockServ.addIdDock(seed, 'things', null, orderData, null)).subscribe( async res => {
      if(res) {
        if(res.ok) {
          console.log('res._body=', res._body);
          const objectId = this.utilServ.sequenceId2ObjectId(res._body._id.substring(0, 60));
          orderData['objectId'] = objectId; 
          
          console.log('orderData===', orderData);

          const abi = {
            "inputs": [
              {
                "internalType": "bytes30",
                "name": "objectId",
                "type": "bytes30"
              },
              {
                "internalType": "bytes30[]",
                "name": "productObjectIds",
                "type": "bytes30[]"
              },
              {
                "internalType": "uint8[]",
                "name": "quantities",
                "type": "uint8[]"
              }
            ],
            "name": "createOrder",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          };

          const args = ['0x' + res._body._id.substring(0, 60), this.productObjectIds, this.quantities];
          const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.smartContractAddress, abi, args);
          console.log('ret from eeee=', ret);
          this.orderServ.create(orderData).subscribe(
            (res: any) => {
              console.log('ress from create order', res);
              if (res && res.ok) {
                const body = res._body;
                const orderID = body._id;
                this.cartStoreServ.empty();
                this.router.navigate(['/address/' + orderID]);
              }
            },
            err => { this.errMsg = err.message; }
          );          
        }
      }});



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
