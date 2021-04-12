import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-collection-edit-header',
    templateUrl: './collection-edit-header.component.html',
    styleUrls: ['./collection-edit-header.component.scss']
  })
  export class NftCollectionEditHeaderComponent implements OnInit {
    @Input() collection: any;
    ngOnInit() {
          
    }

  }
