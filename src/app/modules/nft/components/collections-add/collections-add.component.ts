import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-collections-add',
    templateUrl: './collections-add.component.html',
    styleUrls: ['./collections-add.component.scss']
  })
  export class NftCollectionsAddComponent implements OnInit {
    @Output() createEvent = new EventEmitter<any>();
    name: string;
    description: string;
    ngOnInit() {
          
    }

    createCollection() {
        const data = {
            name: this.name,
            description: this.description
        }
        this.createEvent.emit(data);
    }
  }
