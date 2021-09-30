import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NftAssetService } from '../../services/nft-asset.service';
import { NftCollectionService } from '../../services/nft-collection.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { NftEventService } from '../../services/nft-event.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NftOrder } from '../../models/nft-order';
import { NftUnlockableContentComponent } from '../../modals/unlockable-content/unlockable-content.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import BigNumber from 'bignumber.js/bignumber';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { NftPortService } from '../../services/nft-port.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { KanbanSmartContractService } from '../../../shared/services/kanban.smartcontract.service';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NftOrderService } from '../../services/nft-order.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    providers: [],
    selector: 'app-nft-asset',
    templateUrl: './asset.component.html',
    styleUrls: ['./asset.component.scss']
  })
  export class NftAssetComponent implements OnInit {
    asset: any;
    owner: string;
    sales: any;
    listings: any;
    offers: any;
    balance: number;
    balances: any;
    collection: any;
    address: string;
    contractType: string;
    wallet: any;
    events: any;
    action: string;
    sellOrder: any;
    modalRef: BsModalRef;
    smartContractAddress: string;
    tokenId: string;
    actionOrder: any;
    newPriceEntity: any;
    constructor(
      private localSt: LocalStorage,
      private route: ActivatedRoute,
      private nftPortServ: NftPortService,
      private assetServ: NftAssetService,
      private eventServ: NftEventService,
      private utilServ: UtilService,
      private coinServ: CoinService,
      private translateServ: TranslateService,
      private orderServ: NftOrderService,
      private spinner: NgxSpinnerService,
      private nftOrderServ: NftOrderService,
      private kanbanServ: KanbanService,
      private kanbanSmartContract: KanbanSmartContractService,   
      private modalServ: BsModalService,
      private toastr: ToastrService,
      private collectionServ: NftCollectionService
      ) {

    }

    takeAction(event) {
      this.action = event.action;
      this.actionOrder = event.order;
      if(this.actionOrder) {
        this.actionOrder = NftOrder.from(event.order);
      }
      this.newPriceEntity = event.newPriceEntity;
      this.takeActionDo();
    }

    ngOnInit() {
      this.balance = 0;
      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

        if(!wallets || !wallets.items || (wallets.items.length == 0)) {
          return;
        }
        const wallet = wallets.items[wallets.currentIndex];
        this.wallet = wallet;
        const addresses = wallet.addresses;
        this.address = addresses.filter(item => item.name == 'FAB')[0].address;

        this.route.paramMap.subscribe((params: ParamMap) =>  {
          const smartContractAddress = params.get('smartContractAddress');   
          const tokenId = params.get('tokenId'); 
          this.smartContractAddress = smartContractAddress;
          this.tokenId = tokenId;
  
          
  
          this.collectionServ.getBySmartContractAddress(smartContractAddress).subscribe(
            (res: any) => {
              if(res && res.ok) {
                this.collection = res._body;
                this.contractType = this.collection.type;
                this.loadAsset();
              }
            }          
          );
        });  
      });  

         
    }

    reveal() {
      console.log('revealing');
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onCloseFabPrivateKey.subscribe( (privateKey: any) => {
        const body = {id: this.asset._id};
        const sig = this.kanbanServ.signJsonData(privateKey, body);
        body['sig'] = sig.signature; 
        this.assetServ.reveal(body).subscribe(
          (ret: any) => {
            if(ret && ret.ok) {
              const content = ret._body;
              const initialState = {
                content
              };
              this.modalRef = this.modalServ.show(NftUnlockableContentComponent, { initialState });              
            }
          }
        );
      });
    }

    loadAsset() {
      this.eventServ.getBySmartContractTokenId(this.smartContractAddress, this.tokenId).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.events = res._body;

            console.log('this.eventssss=', this.events);
            if(this.events && this.events.length > 0) {
              this.sales = [];

              const events = this.events.filter(event => event.name == 'Sale');

              if(events && events.length > 0) {
                for(let i = events.length - 1; i >= 0 ; i--) {
                  const event = events[i];

                  const coinType = event.coinType;
                  const coin = event.coinType ? this.utilServ.getCoinNameByTypeId(coinType) : '';
                  const price = event.price;
                  const date = event.dateCreated.
                  replace(/T/, ' ').      // replace T with a space
                  replace(/\..+/, '')     // delete the dot and everything after;
                  const existedSale = this.sales.filter(item => item.name == coin);

                  if(existedSale && existedSale.length > 0) {
                    existedSale[0].series.push(
                      {
                        name: date,
                        value: price
                      }
                    );
                  } else {
                    this.sales.push(
                      {
                        name: coin,
                        series: [
                          {
                            name: date,
                            value: price
                          }                          
                        ]
                      }
                    )
                  }
                } 
              }
             
            }            
          }
      });  


      this.assetServ.getBySmartContractTokenId(this.smartContractAddress, this.tokenId).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.asset = res._body;
            console.log('this.asset=', this.asset);
            if(this.asset) {
              this.balances = this.asset.balances;
              if(this.asset.orders && this.asset.orders.length > 0) {
                const sellOrders = this.asset.orders.filter(item => item.side == 1);              
                //const activeSellOrders = sellOrders.filter(item => !item.txid && (item.maker == this.utilServ.fabToExgAddress(this.owner)));
                const activeSellOrders = sellOrders.filter(item => !item.txid);
                this.listings = sellOrders;

                this.offers = this.asset.orders.filter(item => item.side == 0);   
                console.log('listings=', this.listings);
                if(activeSellOrders && activeSellOrders.length > 0) {
                  let lowestPriceSellOrder = activeSellOrders[0];
                  for(let i=1; i<activeSellOrders.length; i++) {
                    const item = activeSellOrders[i];
                    if(activeSellOrders.basePrice > item.basePrice) {
                      lowestPriceSellOrder = item;
                    }
                  }
                  this.sellOrder = NftOrder.from(lowestPriceSellOrder);
                }
              }  
              
              


              if(this.collection.type == 'ERC1155') {
                this.assetServ.getBalanceOf(this.utilServ.fabToExgAddress(this.address), this.smartContractAddress, this.tokenId).subscribe(
                  (res: any) => {
                    this.balance = new BigNumber(res.data).shiftedBy(-18).toNumber();
                    console.log('balance=', this.balance);
                  }
                );
              } else {
                this.assetServ.getOwner(this.smartContractAddress, this.tokenId).subscribe(
                  (res: any) => {
                    console.log('res in getOwner=', res);
                    this.owner = res.data;
                    this.owner = this.utilServ.exgToFabAddress(this.owner.replace('0x000000000000000000000000', '0x'));
          
                  }
                );
              }



            } 


          }
        }
      );









    }


    takeActionDo() {
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        this.spinner.show();
        if(this.action == 'buy') {
          this.buyDo(seed);
        } else
        if(this.action == 'cancel') {
          this.cancelListingDo(seed);
        } else
        if(this.action == 'change') {
          this.priceChangeDo(seed);
        } else
        if(this.action == 'makeOffer') {
          this.makeOfferDo(seed);
        } else
        if(this.action == 'acceptOffer') {
          this.acceptOfferDo(seed);
        }
      });

    }

    async buyDo(seed: Buffer) {
      let buyorder: NftOrder;
      console.log('go for buye');
      if(this.contractType == 'ERC1155') {
        buyorder = this.nftPortServ.createBuyOrderERC1155(
          this.utilServ.fabToExgAddress(this.address), this.actionOrder);
      } else {
        buyorder = this.nftPortServ.createBuyOrder(
          this.utilServ.fabToExgAddress(this.address), this.actionOrder);
      }

      console.log('hehre');
      console.log('buyorder=', buyorder);
      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey;
      const {signature, hash, hashForSignature} = await this.nftPortServ.getOrderSignature(buyorder, privateKey);
      buyorder.hash = hash;
      buyorder.hashForSignature = hashForSignature;
      buyorder.r = signature.r;
      buyorder.s = signature.s;
      buyorder.v = signature.v;

      buyorder.salt = this.utilServ.getRandomInteger();

      const metadata = null;
      
      console.log('this.actionOrder=', this.actionOrder.toString());
      console.log('buyorder=', buyorder.toString());
      
      const atomicMathAbiArgs = this.nftPortServ.atomicMatch(this.actionOrder, buyorder, metadata);


      console.log('atomicMathAbiArgs in buyDo===', atomicMathAbiArgs);
      const txhex = await this.kanbanSmartContract.getExecSmartContractHex(
        seed, environment.addresses.smartContract.NFT_Exchange, 
        atomicMathAbiArgs.abi, atomicMathAbiArgs.args);
      
      const balances = this.balances;
      
      if(this.contractType == 'ERC1155') {
        
        const buyerAddress = this.utilServ.exgToFabAddress(buyorder.maker);
        const sellerAddress = this.utilServ.exgToFabAddress(buyorder.taker);
        console.log('buyerAddress==', buyerAddress);
        console.log('sellerAddress==', sellerAddress);
        const quantity = this.actionOrder.amount;
        console.log('quantity==', quantity);
        let buyerItemExisted = false;
        for(let i = 0; i < balances.length; i++) {
          const balance = balances[i];
          if(balance.owner == sellerAddress) {
            balance.quantity -= quantity;
            if(balance.quantity == 0) {
              balances.splice(i, 1);
              i --;
              continue;
            } else 
            if(balance.quantity < 0) {
              this.toastr.error('not enough balance for seller.');
              return;
            }
          } else 
          if(balance.owner == buyerAddress) {
            balance.quantity += quantity;
            buyerItemExisted = true;
          }
        }
  
        if(!buyerItemExisted) {
          balances.push(
            {
              owner: buyerAddress,
              quantity: quantity
            }
          );
        }

      }



      this.nftOrderServ.atomicMatch(this.owner, this.actionOrder.id, buyorder, txhex, balances).subscribe(
        (res: any) => {
          console.log('res from atomicMatch=', res);
          this.spinner.hide();
          this.loadAsset();
          if(res && res.ok) {
            this.toastr.info('Post the transaction successfully');
          }else {
            this.toastr.error('Error while posting the transaction');
          }
        }
      );  

    }    


    async priceChangeDo(seed: Buffer) {
      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey;      
      const makerRelayerFee = 0;
      const coinType = this.coinServ.getCoinTypeIdByName(this.newPriceEntity.coin);
      const price = this.newPriceEntity.price;
      const addressHex = this.utilServ.fabToExgAddress(this.address);

      let order: NftOrder;

      if(this.contractType == 'ERC1155') {
        order = this.nftPortServ.createOrderERC1155(
          addressHex, 
          null,
          this.asset.smartContractAddress, 
          this.asset.tokenId,
          coinType, 
          price,
          this.actionOrder.amount,
          makerRelayerFee,
          1);
      } else {
        order = this.nftPortServ.createOrder(
          addressHex, 
          null,
          this.asset.smartContractAddress, 
          this.asset.tokenId,
          coinType, 
          price,
          makerRelayerFee,
          1);
      }





      const {signature, hash, hashForSignature} = await this.nftPortServ.getOrderSignature(order, privateKey);
      order.hash = hash;
      order.hashForSignature = hashForSignature;
      order.r = signature.r;
      order.s = signature.s;
      order.v = signature.v;


      this.nftOrderServ.changePrice(this.actionOrder.id, order).subscribe(
        (res: any) => {
          this.spinner.hide();
          if(res && res.ok) {
            this.toastr.info('Price was changed successfully');
          } else {
            this.toastr.error('Failed to change price');
          }
        }
      );      
    }


    cancelListingDo(seed: Buffer) {
      console.log('this.actionOrder=', this.actionOrder);
      this.nftOrderServ.cancel(this.actionOrder.id ? this.actionOrder.id : this.actionOrder._id ).subscribe(
        (res: any) => {
          if(res && res.ok) {
            const body = res._body;
            this.toastr.info('Your listing was canceled successfully');
            this.spinner.hide();
          } else {
            this.toastr.error('Failed to cancel your listing');
          }
        }
      );
    }   


    async makeOfferDo(seed: Buffer) {
      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey;      
      const makerRelayerFee = 0;
      const coinType = this.coinServ.getCoinTypeIdByName(this.newPriceEntity.coin);
      const price = this.newPriceEntity.price;
      const quantity = this.newPriceEntity.quantity;

      const addressHex = this.utilServ.fabToExgAddress(this.address);

      let order: NftOrder;
      if(this.contractType == 'ERC1155') {
        order = this.nftPortServ.createOrderERC1155(
          addressHex,
          null, 
          this.asset.smartContractAddress, 
          this.asset.tokenId,
          coinType, 
          price,
          quantity,
          makerRelayerFee,
          0);
      } else {
        order = this.nftPortServ.createOrder(
          addressHex,
          null, 
          this.asset.smartContractAddress, 
          this.asset.tokenId,
          coinType, 
          price,
          makerRelayerFee,
          0);
      }


      const {signature, hash, hashForSignature} = await this.nftPortServ.getOrderSignature(order, privateKey);
      order.hash = hash;
      order.hashForSignature = hashForSignature;
      order.r = signature.r;
      order.s = signature.s;
      order.v = signature.v;

      this.orderServ.create(order).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.spinner.hide();
            this.toastr.success(this.translateServ.instant('Make offer successfully'));
            
          }
        }
      );
    }



    async acceptOfferDo(seed: Buffer) {
      console.log('this.actionOrder=', this.actionOrder);
      const sellerAddress = this.utilServ.fabToExgAddress(this.address);
      const buyorder = this.actionOrder;
      let sellorder: NftOrder
      if(buyorder.amount) {
        sellorder = this.nftPortServ.createSellOrderERC1155(
          sellerAddress, buyorder);
      } else {
        sellorder = this.nftPortServ.createSellOrder(
          sellerAddress, buyorder);
      }


      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey;
      const {signature, hash, hashForSignature} = await this.nftPortServ.getOrderSignature(sellorder, privateKey);
      sellorder.hash = hash;
      sellorder.hashForSignature = hashForSignature;
      sellorder.r = signature.r;
      sellorder.s = signature.s;
      sellorder.v = signature.v;

      sellorder.salt = this.utilServ.getRandomInteger();

      const metadata = null;
      console.log('sellOrder=', sellorder.toString());
      console.log('buyorder=', buyorder.toString());
      const atomicMathAbiArgs = this.nftPortServ.atomicMatch(sellorder, buyorder, metadata);


      
      const balances = this.balances;
      
      console.log('old balances=', balances);
      if(this.contractType == 'ERC1155') {
        
        const buyerAddress = this.utilServ.exgToFabAddress(buyorder.maker);
        const sellerAddress = this.utilServ.exgToFabAddress(buyorder.taker);
        console.log('buyerAddress==', buyerAddress);
        console.log('sellerAddress==', sellerAddress);
        const quantity = this.actionOrder.amount;
        console.log('quantity==', quantity);
        let buyerItemExisted = false;
        for(let i = 0; i < balances.length; i++) {
          const balance = balances[i];
          if(balance.owner == sellerAddress) {
            balance.quantity -= quantity;
            if(balance.quantity == 0) {
              balances.splice(i, 1);
              i --;
              continue;
            } else 
            if(balance.quantity < 0) {
              this.toastr.error('not enough balance for seller.');
              return;
            }
          } else 
          if(balance.owner == buyerAddress) {
            balance.quantity += quantity;
            buyerItemExisted = true;
          }
        }
  
        if(!buyerItemExisted) {
          balances.push(
            {
              owner: buyerAddress,
              quantity: quantity
            }
          );
        }

      }

      console.log('new balances=', balances);

     
      const txhex = await this.kanbanSmartContract.getExecSmartContractHex(
        seed, environment.addresses.smartContract.NFT_Exchange, 
        atomicMathAbiArgs.abi, atomicMathAbiArgs.args);
      
      this.orderServ.atomicMatch(this.owner, buyorder.id, sellorder, txhex, balances).subscribe(
        (res: any) => {
          console.log('res from atomicMatch=', res);
          this.spinner.hide();
          if(res && res.ok) {
            this.toastr.info('Post the transaction successfully');
          }else {
            this.toastr.error('Error while posting the transaction');
          }
        }
      );        
    }



  }
