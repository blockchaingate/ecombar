import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { AddressService } from 'src/app/modules/shared/services/address.service';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { IddockService } from 'src/app/modules/shared/services/iddock.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import BigNumber from 'bignumber.js';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { StarService } from 'src/app/modules/shared/services/star.service';

interface ShippingCarrier {
  _id: string;
  image: string;
  name: any; 
  desc: any;
  flatRate: number
  
}
@Component({
  providers: [UserService],
  template:''
})
export class PaymentComponent implements OnInit{

    id: string;
    order: any;
    discount: number;
    tax: number;
    taxRate: number;
    orderID: string;
    total: number;
    starPayMeta: any;
    rewardInfo: any;
    subtotal: number;
    parents: string[];
    agents: string[];
    selectedShippingService: string;
    walletAddress: string;
    totalRewards: any;
    selectedPayment: string;
    smartContractAddress: string;
    feeChargerSmartContractAddress: string;
    shippingFee: number;
    noWallet: boolean;
    wallet: any;
    currency: string;
    storeId: string;
    storeVersion: number;

    modalRef: BsModalRef;
    wallets: any;
    password: string;
    shippingCarriers: ShippingCarrier[] = [
      {
        _id: '1',
        image: '/assets/svg/delivery2.svg',
        name: 'Express delivery',
        desc: 'We ship in 1-2 days',
        flatRate: 10
      },
      {
        _id: '2',
        image: '/assets/svg/v.svg',
        name: 'Standard delivery',
        desc: 'We ship in 3-7 day',
        flatRate: 0
      },
      {
        _id: '3',
        image: '/assets/svg/pickup.svg',
        name: 'Pickup from store',
        desc: 'Today',
        flatRate: 0
      },
    ];


    constructor(
      private iddockServ: IddockService,
      private utilServ: UtilService,
      private web3Serv: Web3Service,
      private coinServ: CoinService,
      private kanbanSmartContractServ: KanbanSmartContractService,   
      private kanbanServ: KanbanService,
      private starServ: StarService,
      private spinner: NgxSpinnerService,
      private modalService: BsModalService,
      private localSt: StorageMap,      
      private router: Router,
      private route: ActivatedRoute, 
      private dataServ: DataService,
      private toastr: ToastrService,
      private userServ: UserService, 
      private orderServ: OrderService, 
      private addressServ: AddressService) {
        this.totalRewards = [];
    }

    calculateTotal() {
      this.subtotal = 0;
      this.total = 0;
      if(!this.order || !this.order.items || (this.order.items.length == 0)) {
        return;
      }
      let subtotalBigNumber = new BigNumber(0);
      let taxBigNumber = new BigNumber(0);
      for(let i=0;i<this.order.items.length;i++) {
        const item = this.order.items[i];
        console.log('item===', item);
        const price = item.price;
        const quantity = item.quantity;
        const taxRate = item.taxRate;
        const subtotalItem = new BigNumber(price).multipliedBy(new BigNumber(quantity));
        subtotalBigNumber = subtotalBigNumber.plus(subtotalItem);
        taxBigNumber = taxBigNumber.plus(subtotalItem.multipliedBy(taxRate).dividedBy(new BigNumber(100)));
      }
      
      this.subtotal = subtotalBigNumber.toNumber();
      this.tax = taxBigNumber.toNumber();
      this.total = subtotalBigNumber.plus(taxBigNumber).plus(new BigNumber(this.shippingFee)).toNumber();
      ;
    }

    ngOnInit() {
      this.storeVersion = 0;
      this.parents = [];
      this.agents = [];
      this.orderID = this.route.snapshot.paramMap.get('orderID');
      this.dataServ.currentWallet.subscribe(
        (wallet: any) => {
          this.wallet = wallet;
        }
      )

      this.dataServ.currentStoreId.subscribe(
        (storeId: string) => {
          this.storeId = storeId;
        }
      );
      this.dataServ.currentStore.subscribe(
        (store: any) => {
          if(store.version) {
            this.storeVersion = store.version;
          }
          this.currency = store.coin;
          this.smartContractAddress = store.smartContractAddress;
          this.taxRate = store.taxRate;
          this.feeChargerSmartContractAddress = store.feeChargerSmartContractAddress;

          this.orderServ.get(this.orderID).subscribe(
            (res: any) => {
              if(res) {
                this.order = res;
                let shippingServiceSelected = 'express';
                if(this.order.shippingServiceSelected) {
                  shippingServiceSelected = this.order.shippingServiceSelected;
                }
                this.selectShippingService(shippingServiceSelected);
              }
            }
          );

          /*
          this.dataServ.currentWalletAddress.subscribe(
            (walletAddress: string) => {
              if(walletAddress) {
                this.orderServ.get7StarPay(this.orderID, walletAddress).subscribe(
                  (res: any) => {
                    if(res && res.ok) {
                      const body = res._body;
                      console.log('body for get7StarPay===', body);
                      this.starPayMeta = body;
                    }
                });
              }
            }
          );
            */
        }
      );   
      
      this.dataServ.currentWalletAddress.subscribe(
        (walletAddress: string) => {
          this.walletAddress = walletAddress;
          if(walletAddress) {
            this.starServ.getParents(walletAddress).subscribe(
              (parents: any) => {
                this.parents = parents.map(item => this.utilServ.fabToExgAddress(item));
              }
            );
          }
        }
      );

      this.starServ.getAgents(this.feeChargerSmartContractAddress).subscribe(
        (ret: any) => {
          if(ret && ret.ok) {
            const agents = ret._body;
            this.agents = agents.map(item => this.utilServ.fabToExgAddress(item));
          }
          
        }
      );
      
      this.discount = 0;
      this.shippingFee = 0;
      this.total = 0;
      this.subtotal = 0;
      


    }



    change() {
      this.router.navigate(['/store/' + this.storeId + '/address/' + this.orderID]);
    }
    
    selectShippingService(service: string) {
      console.log('service=', service);
      if(!service) {
        return;
      }
      this.selectedShippingService = service;
      if(service == 'express') {
        this.shippingFee = 10;
      } else {
        this.shippingFee = 0;
      }
      this.calculateTotal();
    }
 

    placeOrder() {

      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
  
      this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        this.spinner.show();
        this.placeOrderDo(seed);
      });      

    }

    async placeOrderDo(seed: Buffer) {
      const updated = {
        totalShipping: this.shippingFee
      };
      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey; 
      const sig = this.kanbanServ.signJsonData(privateKey, updated);
      updated['sig'] = sig.signature;  

      this.orderServ.update2(this.orderID, updated).subscribe(
        (order) => {
            this.orderServ.getPaycoolRewardInfo(this.orderID, this.walletAddress, 'WithFee').subscribe(
                async (ret: any) => {
                    this.order = ret;

                    const params = this.order.params;
                    console.log('params==', params);
            
                    ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, params[0].to, params[0].data);
                    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
                      ret = await this.kanbanSmartContractServ.execSmartContractAbiHex(seed, params[1].to, params[1].data);
                      if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
                        this.spinner.hide();
                        this.toastr.success('the transaction was procssed successfully');
                        // Fix: 支付后会停在此页面。改为跳去查看所有订单
                        setInterval( () => {
                          this.router.navigate(['/account/orders']);
                        }, 1000);  // 发现未更新状态，给个延时
                      } else {
                        this.spinner.hide();
                        this.toastr.error('Failed to chargeFund with fee, txid:' + ret._body.transactionHash);
                      }
                    } else {
                      this.spinner.hide();
                      this.toastr.error('Failed to authorizeOperator, txid:' + ret._body.transactionHash);
                    }
                }
            );
        }
      );

    }
}