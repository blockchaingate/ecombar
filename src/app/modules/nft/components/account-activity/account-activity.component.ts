import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-account-activity',
    templateUrl: './account-activity.component.html',
    styleUrls: ['./account-activity.component.scss']
  })
  export class NftAccountActivityComponent implements OnInit {

    options = {
        expanded: true
    }    
    ngOnInit() {

    }
  }