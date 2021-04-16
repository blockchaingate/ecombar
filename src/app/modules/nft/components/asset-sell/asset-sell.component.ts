//https://testnets.opensea.io/assets/0xee45b41d1ac24e9a620169994deb22739f64f231/5404270212490003160468058955419049373696167535371251252745102991339628265473/sell

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NftAssetService } from '../../services/nft-asset.service';

@Component({
    providers: [],
    selector: 'app-nft-asset-sell',
    templateUrl: './asset-sell.component.html',
    styleUrls: ['./asset-sell.component.scss']
  })
  export class NftAssetSellComponent implements OnInit {
    asset: any;
    constructor(
      private route: ActivatedRoute,
      private assetServ: NftAssetService
      ) {

    }
    ngOnInit() {
      this.route.paramMap.subscribe((params: ParamMap) =>  {
        const smartContractAddress = params.get('smartContractAddress');   
        const tokenId = params.get('tokenId'); 
        this.assetServ.getBySmartContractTokenId(smartContractAddress, tokenId).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.asset = res._body;
            }
          }
        );
      });          
    }

  }
