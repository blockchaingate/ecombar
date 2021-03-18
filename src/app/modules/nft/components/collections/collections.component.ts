import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    providers: [],
    selector: 'app-nft-collections',
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.scss']
  })
  export class NftCollectionsComponent implements OnInit {
    modalRef: BsModalRef;

    constructor(private modalService: BsModalService) {}
 
   
    ngOnInit() {
          
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    } 

    createCollection(event, templateDone) {
        console.log('event in createCollection=', event);
        this.modalRef.hide();
        this.modalRef = this.modalService.show(templateDone);
    }
  }
