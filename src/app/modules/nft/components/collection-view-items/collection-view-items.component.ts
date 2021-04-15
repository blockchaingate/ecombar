import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-collection-view-items',
    templateUrl: './collection-view-items.component.html',
    styleUrls: ['./collection-view-items.component.scss']
  })
  export class NftCollectionViewItemsComponent implements OnInit {
    @Input() collection: any;
    @Input() assets: any;
    ngOnInit() {
          
    }
    addNewItems() {
        
    }

    getImage(asset) {
      if(asset.media) {
        return asset.media;
      }
      return '/assets/images/placeholder.png';
    }
  }
