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
    sellOrder: any;
    modalRef: BsModalRef;
    smartContractAddress: string;
    tokenId: string;
    
    constructor(
      private localSt: LocalStorage,
      private route: ActivatedRoute,
      private assetServ: NftAssetService,
      private eventServ: NftEventService,
      private utilServ: UtilService,
      private kanbanServ: KanbanService,
      private modalServ: BsModalService,
      private collectionServ: NftCollectionService
      ) {

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

                if(activeSellOrders && activeSellOrders.length > 0) {
                  this.sellOrder = NftOrder.from(activeSellOrders[activeSellOrders.length - 1]);
                  console.log('this.sellOrder====', this.sellOrder);
                }
              }  
              
              


              if(this.collection.type == 'ERC1155') {
                console.log('this.address==', this.address);
                this.assetServ.getBalanceOf(this.utilServ.fabToExgAddress(this.address), this.smartContractAddress, this.tokenId).subscribe(
                  (res: any) => {
                    console.log('res in getBalanceOf=', res);
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
  }
