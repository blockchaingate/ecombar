import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';
import { ShipService } from 'src/app/modules/shared/services/ship.service';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { Store } from '@ngrx/store';
import { UserState } from '../../../../store/states/user.state';
import { selectMerchantId } from 'src/app/store/selectors/user.selector';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';

@Component({
  selector: 'app-admin-shipping',
  providers: [],
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit{
    provider: string;
    trackingNumber: string;
    status: number;
    modalRef: BsModalRef;
    orderID: string;
    allItemsFlag: boolean;
    providers: any;
    wallet: any;
    items: any;
    item: any;
    itemsAdded: any;
    quantity: number;

    constructor(
      public kanbanServ: KanbanService,
      private modalService: BsModalService,
      private merchantServ: MerchantService,
      private store: Store<{ user: UserState }>,
      private dataServ: DataService,
      private route: ActivatedRoute, 
      private shipServ: ShipService,
      private orderServ: OrderService,
      private router: Router) {

    }

    ngOnInit() {
      this.dataServ.currentWallet.subscribe(
        (wallet: string) => {
          this.wallet = wallet;
        }
      ); 

      this.allItemsFlag = true;
      this.items = [];
      this.itemsAdded = [];
      this.merchantServ.getByType('delivery').subscribe(
        (res: any) => {
          console.log('res for getdelivery===', res);
          if(res && res.ok) {
            this.providers = res._body;
            console.log('this.providers=', this.providers);
          }
        }
      );
      this.orderID = this.route.snapshot.paramMap.get('orderID');
      this.store.select(selectMerchantId).subscribe(
        merchantId => {
          this.orderServ.get(this.orderID).subscribe(
            (res: any) => {
              if(res && res.ok) {
                const data = res._body;
                console.log('data=', data);
                this.provider = data.shippingServiceIdSelected;
                this.trackingNumber = data.trackingNumber,
                this.status = data.shippingStatus;
                const items = data.items;
                for(let i=0;i<items.length;i++) {
                  const item = items[i];
                  if(item.productId.merchantId !== merchantId) {
                    continue;
                  }
                  this.items.push(item);
                }
              }
            }
          );
        }
      );

    }

    update() {
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
  
      this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
        this.updateDo(privateKey);
      });
    }

    updateDo(privateKey: any) {
      let items = [];
      if(!this.allItemsFlag) {
        items = this.itemsAdded;
      }
      const data = {
        deliveryMerchantId: this.provider,
        orderId: this.orderID,
        trackingNumber: this.trackingNumber,
        items: items
      }

      const sig = this.kanbanServ.signJsonData(privateKey, data);
      data['sig'] = sig.signature; 
      
      this.shipServ.createShip(data).subscribe(
        (res: any) => {
          if(res && res.ok) {
            console.log('updated successfully');
          }
        }
      );
    }

    addItem() {
      console.log('this.item=', this.item);
      const existedItem = this.itemsAdded.filter(itemAdded => itemAdded.productId === this.item);
      if(existedItem && existedItem.length > 0) {
        existedItem[0].quantity += Number(this.quantity);
      } else {
        this.itemsAdded.push({productId: this.item, quantity: Number(this.quantity)});
      }

      console.log('this.itemsAdded==', this.itemsAdded);
    }

    deleteItem(productId) {
      this.itemsAdded = this.itemsAdded.filter(itemAdded => itemAdded.productId !== productId);
    }

    getProductName(productId) {
      const product = this.items.filter(item => item._id === productId);
      if(product) {
        return product.name;
      }
      return "";
    }
}

/*
    shippingMethodSelected: Boolean,
    shippingServiceSelected: String,
    shippingServiceIdSelected: String,
    shippedTime: Date,

    active: Boolean,
    
    checkoutStatus: Boolean,
    paymentStatus: Number, //0: waiting for pay, 1: paid already, 2: finished, 3: cancelled, 4: frozened 
    shippingStatus: Number, //0: not started, 1: sent, 2: received
*/