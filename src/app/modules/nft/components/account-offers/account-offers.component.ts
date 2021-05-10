import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-account-offers',
    templateUrl: './account-offers.component.html',
    styleUrls: ['./account-offers.component.scss']
  })
  export class NftAccountOffersComponent implements OnInit {

    options = {
        expanded: true
    }   
    ngOnInit() {

    }
  }