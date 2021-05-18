import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
    providers: [],
    selector: 'app-nft-price-change',
    templateUrl: './price-change.component.html',
    styleUrls: ['./price-change.component.scss']
  })
  export class NftPriceChangeComponent implements OnInit {
    public onClose: Subject<any>;

    entity: any;
    
    constructor(private bsModalRef: BsModalRef) {}
    ngOnInit() {
        this.onClose = new Subject<any>();
    }

    close() {
        this.bsModalRef.hide();
    }    

    
    confirm() {
        this.onClose.next(this.entity);
        this.close();
    }

    onUpdateEntity(event) {
        this.entity = event;
    }
  }
