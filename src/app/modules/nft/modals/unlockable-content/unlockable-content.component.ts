import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    providers: [],
    selector: 'app-nft-unlockable-content',
    templateUrl: './unlockable-content.component.html',
    styleUrls: ['./unlockable-content.component.scss']
  })
  export class NftUnlockableContentComponent implements OnInit {
      content: string;
      constructor(private bsModalRef: BsModalRef) {}
      ngOnInit() {

      }

      close() {
        this.bsModalRef.hide();
    }       
  }