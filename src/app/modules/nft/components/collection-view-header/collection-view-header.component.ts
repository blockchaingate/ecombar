import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-collection-view-header',
    templateUrl: './collection-view-header.component.html',
    styleUrls: ['./collection-view-header.component.scss']
  })
  export class NftCollectionViewHeaderComponent implements OnInit {
    @Input() collection: any;
    ngOnInit() {
          
    }

    getImageUrl() {
      return encodeURI(this.collection.image);
    }
  }
