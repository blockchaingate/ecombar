import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    providers: [],
    selector: 'app-nft-collection-assets-create-done',
    templateUrl: './collection-assets-create-done.component.html',
    styleUrls: ['./collection-assets-create-done.component.scss']
  })
  export class NftCollectionAssetsCreateDoneComponent implements OnInit {
    @Input() asset: any;
    constructor(private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit() {
          
    }
    visit() {
      this.router.navigate(['/nft/assets/' + this.asset.smartContractAddress + '/' + this.asset.tokenId]);
    }

    sell() {
      this.router.navigate(['/nft/admin/assets/' + this.asset.smartContractAddress + '/' + this.asset.tokenId + '/sell']);
    }
  }
