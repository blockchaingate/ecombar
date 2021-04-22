import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NftAssetService } from '../../services/nft-asset.service';
import { NftCollectionService } from '../../services/nft-collection.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
    providers: [],
    selector: 'app-nft-asset',
    templateUrl: './asset.component.html',
    styleUrls: ['./asset.component.scss']
  })
  export class NftAssetComponent implements OnInit {
    asset: any;
    collection: any;
    address: string;
    wallet: any;
    
    constructor(
      private localSt: LocalStorage,
      private route: ActivatedRoute,
      private assetServ: NftAssetService,
      private collectionServ: NftCollectionService
      ) {

    }

    ngOnInit() {
      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

        if(!wallets || (wallets.length == 0)) {
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
        this.assetServ.getBySmartContractTokenId(smartContractAddress, tokenId).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.asset = res._body;
            }
          }
        );

        this.collectionServ.getBySmartContractAddress(smartContractAddress).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.collection = res._body;
            }
          }          
        );
      });           
    }

  }
