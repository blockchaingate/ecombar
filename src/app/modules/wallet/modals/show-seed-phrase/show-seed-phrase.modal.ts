import { Component, ViewChild, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'show-seed-phrase-modal',
    templateUrl: './show-seed-phrase.modal.html',
    styleUrls: ['./show-seed-phrase.modal.css']
})
export class ShowSeedPhraseModal {
    seedPhrase: string;
    constructor(private modalRef: BsModalRef) {

    }

    close() {
        this.modalRef.hide();
    } 

}
