import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NftAssetService } from '../../services/nft-asset.service';
import { NftCollectionService } from '../../services/nft-collection.service';

@Component({
    providers: [],
    selector: 'app-nft-collection-edit',
    templateUrl: './collection-edit.component.html',
    styleUrls: ['./collection-edit.component.scss']
  })
  export class NftCollectionEditComponent implements OnInit {
      slug: string;
      collection: any;

      constructor(
        private route: ActivatedRoute,
        private router: Router,
        private assetServ: NftAssetService,
        private toastrServ: ToastrService,
        private utilServ: UtilService,
        private collectionServ: NftCollectionService
      ) { }

      ngOnInit() {
        this.route.paramMap.subscribe( paramMap => {
            const slug = paramMap.get('slug');
            this.collectionServ.getBySlug(slug).subscribe(
              (res: any) => {
                if(res && res.ok) {
                  this.collection = res._body;
                }
            });
        });
      }

      updateCollection() {
        let payoutPercentageFee = 0;
        try {
          payoutPercentageFee = Number(this.collection.payoutPercentageFee);
        } catch(e) {
          this.toastrServ.error('payoutPercentageFee is wrong.');
          return;         
        }
        if((payoutPercentageFee <= 0) || (payoutPercentageFee >= 100) || (Number.isNaN(payoutPercentageFee))) {
          this.toastrServ.error('payoutPercentageFee is wrong.');
          return;
        }
        try {
          const exgAddress = this.utilServ.fabToExgAddress(this.collection.payoutWalletAddress);
          const len = exgAddress.length;
          if(len != 42) {
            this.toastrServ.error('payoutWalletAddress is wrong.');
            return;             
          }
        } catch(e) {
          this.toastrServ.error('payoutWalletAddress is wrong.');
          return;          
        }
        const data = {
            name: this.collection.name,
            description: this.collection.description,
            image: this.collection.image,
            payoutPercentageFee: payoutPercentageFee,
            payoutWalletAddress: this.collection.payoutWalletAddress
        }   
        this.collectionServ.update(this.collection._id, data).subscribe(
            (res: any) => {
                if(res && res.ok) {
                    this.router.navigate(['/nft/admin/collections/' + this.collection.slug + '/view']);
                }
            }
        );               
      }
  }