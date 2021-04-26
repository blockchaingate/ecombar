import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
    providers: [],
    selector: 'app-nft-asset-info',
    templateUrl: './asset-info.component.html',
    styleUrls: ['./asset-info.component.scss']
  })
  export class NftAssetInfoComponent implements OnInit {
    @Input() asset: any;
    @Input() collection: any;
    @Input() owner: string;
    @Input() address: string;

    constructor(private utilServ: UtilService) {}
    ngOnInit() {
         
    }

  }
