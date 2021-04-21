//https://testnets.opensea.io/assets/0xee45b41d1ac24e9a620169994deb22739f64f231/5404270212490003160468058955419049373696167535371251252745102991339628265473/sell

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NftAssetService } from '../../services/nft-asset.service';
import { NftOrder } from '../../models/nft-order';
import { NftPortService } from '../../services/nft-port.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
    providers: [],
    selector: 'app-nft-asset-sell',
    templateUrl: './asset-sell.component.html',
    styleUrls: ['./asset-sell.component.scss']
  })
  export class NftAssetSellComponent implements OnInit {
    asset: any;
    smartContractAddress: string;
    tokenId: string;
    address: string;
    constructor(
      private localSt: LocalStorage,
      private route: ActivatedRoute,
      private utilServ: UtilService,
      private assetServ: NftAssetService,
      private nftPortServ: NftPortService
      ) {

    }
    ngOnInit() {

      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

        if(!wallets || (wallets.length == 0)) {
          return;
        }
        const wallet = wallets.items[wallets.currentIndex];
        const addresses = wallet.addresses;
        this.address = addresses.filter(item => item.name == 'FAB')[0].address;
      });      

      this.route.paramMap.subscribe((params: ParamMap) =>  {
        const smartContractAddress = params.get('smartContractAddress');   
        const tokenId = params.get('tokenId'); 
        this.smartContractAddress = smartContractAddress;
        this.tokenId = tokenId;
        this.assetServ.getBySmartContractTokenId(smartContractAddress, tokenId).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.asset = res._body;
            }
          }
        );
      });          
    }

    postListing() {
      console.log('postListing do');
      const makerRelayerFee = 250;
      const coinType = 12234;
      const price = 1;
      const order: NftOrder = this.nftPortServ.createSellOrder(
        this.utilServ.fabToExgAddress(this.address), 
        this.asset.smartContractAddress, 
        this.asset.tokenId,
        coinType, 
        price,
        makerRelayerFee);
      console.log('order = ', order );
      //this.nftPortServ.createSellOrder(this.asset.smartContractAddress, this.asset.tokenId);
    }

  }
