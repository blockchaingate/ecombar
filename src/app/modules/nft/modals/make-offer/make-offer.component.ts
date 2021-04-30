import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

@Component({
    providers: [],
    selector: 'app-nft-make-offer',
    templateUrl: './make-offer.component.html',
    styleUrls: ['./make-offer.component.scss']
  })
  export class NftMakeOfferComponent implements OnInit {
    public onClose: Subject<Buffer>;

    entity: any;
    constructor(private bsModalRef: BsModalRef) {}
    ngOnInit() {
        this.onClose = new Subject();
    }

    close() {
        this.bsModalRef.hide();
    }    

    onUpdateEntity(event) {
      this.entity = event;
    }
    
    makeOffer() {
        this.onClose.next(this.entity);
        this.close();
    }

  }
