import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    providers: [],
    selector: 'app-nft-collection-assets-create-done',
    templateUrl: './collection-assets-create-done.component.html',
    styleUrls: ['./collection-assets-create-done.component.scss']
  })
  export class NftCollectionAssetsCreateDoneComponent implements OnInit {

    constructor(private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit() {
          
    }
    visit() {

    }

    sell() {
      this.router.navigate(['/nft/admin/asset/sell']);
    }
  }
