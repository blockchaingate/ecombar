import { Component, OnInit, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-account-offers',
    templateUrl: './account-offers.component.html',
    styleUrls: ['./account-offers.component.scss']
  })
  export class NftAccountOffersComponent implements OnInit {
    @Input() address: string;
    @Input() collections: any;

    selectedCollections: any;
    options = {
        expanded: true
    }   
    ngOnInit() {

    }
  }