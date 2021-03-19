import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-collections-add-done',
    templateUrl: './collections-add-done.component.html',
    styleUrls: ['./collections-add-done.component.scss']
  })
  export class NftCollectionsAddDoneComponent implements OnInit {
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
