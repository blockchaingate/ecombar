import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-account-overview',
    templateUrl: './account-overview.component.html',
    styleUrls: ['./account-overview.component.scss']
  })
  export class NftAccountOverviewComponent implements OnInit {
    @Input() address: string;
    ngOnInit() {
          
    }

  }