import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-collections-list',
    templateUrl: './collections-list.component.html',
    styleUrls: ['./collections-list.component.scss']
  })
  export class NftCollectionsListComponent implements OnInit {
    @Output() createEvent = new EventEmitter<string>();
    ngOnInit() {
          
    }

    createCollection() {
        this.createEvent.emit('create');
    }
  }
