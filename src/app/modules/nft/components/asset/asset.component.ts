import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NftAssetService } from '../../services/nft-asset.service';
import { NftCollectionService } from '../../services/nft-collection.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { NftOrderService } from '../../services/nft-order.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';

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
    collection: any;
    address: string;
    wallet: any;
    smartContractAddress: string;
    tokenId: string;
    
    constructor(
      private localSt: LocalStorage,
      private route: ActivatedRoute,
      private assetServ: NftAssetService,
      private orderServ: NftOrderService,
      private utilServ: UtilService,
      private collectionServ: NftCollectionService
      ) {

    }

    ngOnInit() {
      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

        if(!wallets || !wallets.items || (wallets.items.length == 0)) {
          return;
        }
        const wallet = wallets.items[wallets.currentIndex];
        this.wallet = wallet;
        const addresses = wallet.addresses;
        this.address = addresses.filter(item => item.name == 'FAB')[0].address;
      });  

      this.route.paramMap.subscribe((params: ParamMap) =>  {
        const smartContractAddress = params.get('smartContractAddress');   
        const tokenId = params.get('tokenId'); 
        this.smartContractAddress = smartContractAddress;
        this.tokenId = tokenId;

        this.loadAsset();

        this.collectionServ.getBySmartContractAddress(smartContractAddress).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.collection = res._body;
            }
          }          
        );
      });           
    }

    loadAsset() {
      this.assetServ.getBySmartContractTokenId(this.smartContractAddress, this.tokenId).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.asset = res._body;
            if(this.asset && this.asset.events) {
              this.sales = [];

              const events = this.asset.events.filter(event => event.event == 'Sale');

              if(events && events.length > 0) {
                for(let i = 0; i < events.length; i++) {
                  const event = events[i];
                  const coin = this.utilServ.getCoinNameByTypeId(event.coinType);
                  const price = event.price;
                  const date = event.date;
                  const existedSale = events.filter(item => item.name == coin);
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
        }
      );


      this.assetServ.getOwner(this.smartContractAddress, this.tokenId).subscribe(
        (res: any) => {
          this.owner = res.data;
          this.owner = this.utilServ.exgToFabAddress(this.owner.replace('0x000000000000000000000000', '0x'));

        }
      );
    }
  }
