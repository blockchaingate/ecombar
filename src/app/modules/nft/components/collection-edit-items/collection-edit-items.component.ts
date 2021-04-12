import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-collection-edit-items',
    templateUrl: './collection-edit-items.component.html',
    styleUrls: ['./collection-edit-items.component.scss']
  })
  export class NftCollectionEditItemsComponent implements OnInit {
    @Input() collection: any;
    ngOnInit() {
          
    }
    addNewItems() {
        
    }
  }
