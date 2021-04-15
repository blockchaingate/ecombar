import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NftAssetService } from '../../services/nft-asset.service';
import { NftCollectionService } from '../../services/nft-collection.service';

@Component({
    providers: [],
    selector: 'app-nft-collection-view',
    templateUrl: './collection-view.component.html',
    styleUrls: ['./collection-view.component.scss']
  })
  export class NftCollectionViewComponent implements OnInit {
    collection: any;
    assets: any;
    
    constructor(
      private route: ActivatedRoute,
      private assetServ: NftAssetService,
      private collectionServ: NftCollectionService
      ) { }

    ngOnInit() {
      this.route.paramMap.subscribe( paramMap => {
        const slug = paramMap.get('slug');
        this.collectionServ.getBySlug(slug).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.collection = res._body;
              const smartContractAddress = this.collection.smartContractAddress;
              this.assetServ.getBySmartContract(smartContractAddress).subscribe(
                (res :any) => {
                  if(res && res.ok) {
                    this.assets = res._body;
                    console.log('this.assets=', this.assets);
                  }
                }
              );
            }
          }
        );

      });          
    }

  }
