import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    providers: [],
    selector: 'app-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {
    title: string;
    subtitle: string;
    data: any;

    constructor(
        private bsModalRef: BsModalRef) {}    

    ngOnInit() {
        if(this.data.length == 0) {
            this.data.push(
                {
                    type: '',
                    name: ''
                }
            );
        }
        
    }

    close() {
        this.bsModalRef.hide();
    }

    addMore() {
        this.data.push(
            {
                type: '', 
                name: ''
            }
        );
    }

    removeByIndex(i: number) {
        this.data.splice(i, 1);
    }

    saveClick() {
        this.data = this.data.filter(item => item.type != '' && item.name != '');
        this.close();
    }
}