import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

@Component({
    providers: [],
    selector: 'app-nft-cancel-listing',
    templateUrl: './cancel-listing.component.html',
    styleUrls: ['./cancel-listing.component.scss']
  })
  export class NftCancelListingComponent implements OnInit {
    public onClose: Subject<string>;

    entity: any;
    constructor(private bsModalRef: BsModalRef) {}
    ngOnInit() {
        this.onClose = new Subject();
    }

    close() {
        this.bsModalRef.hide();
    }    

    
    confirm() {
        this.onClose.next('confirm');
        this.close();
    }

  }
