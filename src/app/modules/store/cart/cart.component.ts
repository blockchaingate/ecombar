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
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from '../../shared/services/web3.service';
import { KanbanService } from '../../shared/services/kanban.service';
import BigNumber from 'bignumber.js';
import { CoinService } from '../../shared/services/coin.service';

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
  storeOwner: string;
  payQrcode: string;
  storeId: string;
  store: any;
  currency: string;
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

    this.dataServ.currentStore.subscribe(
      (store: any) => {
        if(store) {
          this.currency = store.coin;
          this.smartContractAddress = store.smartContractAddress;
          this.storeId = store._id;
          this.taxRate = store.taxRate;
          this.storeOwner = store.owner;
          const storedCart = this.cartStoreServ.items;
          this.cartItems = storedCart ? storedCart.filter((item) => item.storeId == this.storeId) : [];
          this.calculateTotal();
        }

      }
    );



  }

  checkout() {
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
    const merchantIds = [];
    this.productObjectIds = [];
    this.quantities = [];
    
    let transAmount = 0;

    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;

    this.cartItems.forEach(item => {
      console.log('item=', item);
      this.productObjectIds.push('0x' + this.utilServ.ObjectId2SequenceId(item.objectId));
      this.quantities.push(item.quantity);

      transAmount += item.quantity * item.price;
      const titleTran = this.translateServ.transField(item.title);
      item.title = titleTran ? titleTran : item.title;
      items.push(item);
    });
    let currency = this.currency;
    const orderData = { store: this.storeId, storeOwner: this.storeOwner, items, currency, transAmount };


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
              },
              {
                "internalType": "uint256",
                "name": "total",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "tax",
                "type": "uint256"
              }
            ],
            "name": "createOrder",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          };

          const args = [
            '0x' + res._body._id.substring(0, 60), 
            this.productObjectIds, 
            this.quantities, 
            new BigNumber(this.total).multipliedBy(1e18), 
            new BigNumber(this.tax).multipliedBy(1e18)];
          console.log('args for crate Order=', args);
          const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.smartContractAddress, abi, args);




          if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
            console.log('go for creating order');

            const sig = this.kanbanServ.signJsonData(privateKey, orderData);
            orderData['sig'] = sig.signature;               
            this.orderServ.create2(orderData).subscribe(
              (res: any) => {
                console.log('ress from create order', res);
                if (res && res.ok) {
                  const body = res._body;
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
          } else {
            this.spinner.hide();
            this.toastr.error('failed to create order in smart contract');               
          }
        
        }
        else {
          this.spinner.hide();
          this.toastr.error('error while saving to iddock');
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
