import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
        const data = {
            name: this.collection.name,
            description: this.collection.description,
            image: this.collection.image
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