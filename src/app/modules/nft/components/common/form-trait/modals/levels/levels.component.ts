import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    providers: [],
    selector: 'app-levels',
    templateUrl: './levels.component.html',
    styleUrls: ['./levels.component.scss']
})
export class LevelsComponent implements OnInit {
    title: string;
    subtitle: string;

    constructor(
        private bsModalRef: BsModalRef) {}    

    ngOnInit() {

    }
    close() {
        this.bsModalRef.hide();
    }
}