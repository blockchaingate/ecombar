import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NftCollectionService } from '../../services/nft-collection.service';

@Component({
    providers: [],
    selector: 'app-nft-collection-edit',
    templateUrl: './collection-edit.component.html',
    styleUrls: ['./collection-edit.component.scss']
  })
  export class NftCollectionEditComponent implements OnInit {
    collection: any;
    constructor(
      private route: ActivatedRoute,
      private collectionServ: NftCollectionService
      ) {

    }
    ngOnInit() {
      this.route.paramMap.subscribe( paramMap => {
        const slug = paramMap.get('slug');
        this.collectionServ.getBySlug(slug).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.collection = res.data;
            }
          }
        );
      });          
    }

  }
