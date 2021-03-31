import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    providers: [],
    selector: 'app-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {
    constructor(
        private bsModalRef: BsModalRef) {}    

    ngOnInit() {

    }
    close() {
        this.bsModalRef.hide();
    }
}