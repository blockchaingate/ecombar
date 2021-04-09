import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-collections-add-done',
    templateUrl: './collections-add-done.component.html',
    styleUrls: ['./collections-add-done.component.scss']
  })
  export class NftCollectionsAddDoneComponent implements OnInit {
    @Input() collection: any;
    @Output() createEvent = new EventEmitter<any>();
    name: string;
    description: string;
    ngOnInit() {
          
    }

    createItem() {
        const data = {
            name: this.name,
            description: this.description
        }
        this.createEvent.emit(data);
    }
  }
