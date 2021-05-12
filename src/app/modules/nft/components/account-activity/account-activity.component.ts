import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-account-activity',
    templateUrl: './account-activity.component.html',
    styleUrls: ['./account-activity.component.scss']
  })
  export class NftAccountActivityComponent implements OnInit {
    @Input() collections: any;
    selectedCollections: any;
    selectedEventTypes: any;
    options = {
        expanded: true
    }    
    ngOnInit() {
      this.selectedCollections = [];
      this.selectedEventTypes = [];
    }
  }