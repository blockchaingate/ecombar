import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { AddressService } from 'src/app/modules/shared/services/address.service';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { IddockService } from 'src/app/modules/shared/services/iddock.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import BigNumber from 'bignumber.js';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
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
      private localSt: LocalStorage,      
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
        //const giveAwayRate = item.giveAwayRate;
        //const lockedDays = item.lockedDays;
        const subtotalItem = new BigNumber(price).multipliedBy(new BigNumber(quantity));
        subtotalBigNumber = subtotalBigNumber.plus(subtotalItem);
        taxBigNumber = taxBigNumber.plus(subtotalItem.multipliedBy(taxRate).dividedBy(new BigNumber(100)));
        /*
        const realGiveAwayRate = giveAwayRate - 1;
        const realGiveAways = subtotalItem.multipliedBy(realGiveAwayRate).dividedBy(new BigNumber(100));
        let existed = false;
        for(let j = 0; j < this.totalRewards.length; j++) {
          const totalRewardItem = this.totalRewards[j];
          if(totalRewardItem.lockedDays == lockedDays) {
            totalRewardItem.rewards = totalRewardItem.rewards.plus(realGiveAways);
            existed = true;
            break;
          }
        }
        if(!existed) {
          this.totalRewards.push({
              lockedDays: lockedDays,
              rewards: realGiveAways
          });
        }
        */
      }
      
      this.subtotal = subtotalBigNumber.toNumber();
      this.tax = taxBigNumber.toNumber();
      this.total = subtotalBigNumber.plus(taxBigNumber).toNumber();
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
              if(res && res.ok) {
                this.order = res._body;
                console.log('this.orderhaha=', this.order);
                this.selectPayment(this.order.paymentMethod);
                let shippingServiceSelected = 'express';
                if(this.order.shippingServiceSelected) {
                  shippingServiceSelected = this.order.shippingServiceSelected;
                }
                this.selectShippingService(shippingServiceSelected);
              }
            }
          );

          this.dataServ.currentWalletAddress.subscribe(
            (walletAddress: string) => {
              if(walletAddress) {
                this.orderServ.get7StarPay(this.orderID, this.currency, walletAddress).subscribe(
                  (res: any) => {
                    if(res && res.ok) {
                      const body = res._body;
                      console.log('body===', body);
                      this.starPayMeta = body;
                    }
                });
              }
            }
          );

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

    selectPayment(payment: string) {
      if(!payment) {
        return;
      }
      if(payment == 'usdt') {
        this.discount = 3;
      } else {
        this.discount = 0;
      }
      this.selectedPayment = payment;
    }   

    placeOrder() {
      if(!this.parents || this.parents.length == 0) {
        this.toastr.info('Cannot get your referral addresses, please refresh the page and try again.');
        return;
      } 
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
  
      this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        this.spinner.show();
        this.placeOrderDo(seed);
      });      
      /*
      if (!this.selectedShippingService) {
        return;
      }
      if (!this.selectedPayment) {
        return;
      }  

      this.ngxSmartModalServ.getModal('passwordModal').open();
      */
    }

    getAbiArgs(seed) {
      let abi;
      let args;
      let to;
      if(this.storeVersion == 0) {
        abi = {
          "inputs": [
            {
              "internalType": "bytes30",
              "name": "objectId",
              "type": "bytes30"
            },
            {
              "internalType": "uint256",
              "name": "fullfilmentFee",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_user",
              "type": "address"
            },
            {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            },
            {
              "name": "_regionalAgents",
              "type": "address[]"
            },          
            {
              "internalType": "address[]",
              "name": "_rewardBeneficiary",
              "type": "address[]"
            }
          ],
          "name": "payOrder",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        };
        const msg = '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId) + '0000';
        const hashForSignature = this.web3Serv.hashKanbanMessage(msg);
        const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        const privateKey = keyPair.privateKeyBuffer.privateKey; 
        const signature = this.web3Serv.signKanbanMessageHashWithPrivateKey(hashForSignature, privateKey);  
        const fulfillmentFee = '0x' + (new BigNumber(this.shippingFee).multipliedBy(new BigNumber(1e18)).toString(16));
  
        this.agents = [];
        args = [
          '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId),
          fulfillmentFee,
          this.utilServ.fabToExgAddress(this.walletAddress),
          signature.v,
          signature.r,
          signature.s,
          this.agents,
          this.parents
        ];
        to = this.smartContractAddress;
      }

      if(this.storeVersion == 2) {
        abi = {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "_orderID",
              "type": "bytes32"
            },
            {
              "internalType": "uint32",
              "name": "_paidCoin",
              "type": "uint32"
            },
            {
              "internalType": "uint256",
              "name": "_totalAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_totalTax",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_totalRewardInPaidCoin",
              "type": "uint256"
            },
            {
              "internalType": "address[]",
              "name": "_regionalAgents",
              "type": "address[]"
            },
            {
              "internalType": "bytes32[]",
              "name": "_rewardBeneficiary",
              "type": "bytes32[]"
            },
            {
              "internalType": "bytes",
              "name": "_rewardInfo",
              "type": "bytes"
            }
          ],
          "name": "chargeFundsWithFee",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        };
        args = [
          '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId),
          this.coinServ.getCoinTypeIdByName(this.currency),
          '0x' + new BigNumber(this.starPayMeta.totalAmount).shiftedBy(18).toString(16),
          '0x' + new BigNumber(this.starPayMeta.totalTax).shiftedBy(18).toString(16),
          '0x' + new BigNumber(this.starPayMeta.totalRewardInPaidCoin).shiftedBy(18).toString(16),
          //this.starPayMeta.regionalAgents,
          ['0x02c55515e62a0b25d2447c6d70369186b8f10359'],
          this.starPayMeta.rewardBeneficiary,
          this.starPayMeta.rewardInfo
        ];
        console.log('args there we go4444===', args);
        to = this.feeChargerSmartContractAddress;
        console.log('to=', to);
      };

      return {to, abi, args};
    }
    async placeOrderDo(seed: Buffer) {
      //const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.password); 


      const item = {
        totalSale: this.subtotal,
        totalShipping: this.shippingFee,
        totalToPay: this.total * (1 - this.discount / 100),
        paymentMethod: this.selectedPayment,
        paymentStatus: 0,
        charge_id: '',
        shippingServiceSelected: this.selectedShippingService
      }



      const {to, abi, args} = this.getAbiArgs(seed);
      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey; 
      
      const ret = await this.kanbanSmartContractServ.execSmartContract(seed, to, abi, args);
      console.log('ret from payment=', ret);    

      if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
        item.paymentStatus = 2;
        const body = ret._body;
        console.log('body==', body);
        item.charge_id = body.transactionHash;    
        console.log('charge_id==', item.charge_id);  
        
        const updatedOrderForIdDock = {
          merchantId: this.order.merchantId,
          items: this.order.items,
          currency: this.order.currency,
          transAmount: this.order.transAmount,
          name: this.order.name,
          unit: this.order.suite,
          streetNumber: this.order.streetNumber,
          streetName: this.order.street,
          city: this.order.city,
          province: this.order.province,
          zip: this.order.postcode,
          country: this.order.country,
          ...item
        };         
        (await this.iddockServ.updateIdDock(seed, this.order.objectId, 'things', null, updatedOrderForIdDock, null)).subscribe(async res => {
          if(res) {
            if(res.ok) {
              const sig = this.kanbanServ.signJsonData(privateKey, item);
              item['sig'] = sig.signature;  

              this.orderServ.update2(this.orderID, item).subscribe(
                (res: any) => {
                  if(res && res.ok) {
                    this.order = res._body;
                    this.toastr.success('payment was made successfully');
                    this.spinner.hide();

                    this.kanbanServ.getExchangeBalance(this.utilServ.fabToExgAddress(this.walletAddress)).subscribe(
                      (resp: any) => {
                          console.log('resp in here we go=', resp);
                          const selected = resp.filter(item => item.coinType == this.coinServ.getCoinTypeIdByName(this.currency));
                          if(selected && selected.length > 0) {
                            const currencyBalance = this.utilServ.showAmount(selected[0].unlockedAmount, 18);
                            this.dataServ.changeCurrencyBalance(Number(currencyBalance));
                          }
                      },
                      error => {
                      }
                    );                    
                    //this.router.navigate(['/place-order/' + this.orderID]);
                  }
                }
              );  
              
            } else {
              this.spinner.hide();
              this.toastr.error(res._body);
            }
            
          }
        });



      } else {
        this.spinner.hide();
        this.toastr.error('payment failed');
      }      








    }
}