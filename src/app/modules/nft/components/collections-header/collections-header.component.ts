import { Component, OnInit, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-collections-header',
    templateUrl: './collections-header.component.html',
    styleUrls: ['./collections-header.component.scss']
  })
  export class NftCollectionsHeaderComponent implements OnInit {
    @Input() title: string;
    @Input() subtitle: string;
    @Input() new: boolean;
      ngOnInit() {
          
      }
  }
