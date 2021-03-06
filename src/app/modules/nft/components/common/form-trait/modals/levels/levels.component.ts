import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
    data: any;


    constructor(
        private bsModalRef: BsModalRef) {}    

    ngOnInit() {
        if(this.data.length == 0) {
            this.data.push(
                {
                    name: '',
                    value: 3,
                    max: 5
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
                name: '',
                value: 3,
                max: 5
            }
        );
    }

    removeByIndex(i: number) {
        this.data.splice(i, 1);
    }

    saveClick() {
        this.data = this.data.filter(item => item.name != '');
        console.log('this.data=', this.data);
        this.close();
    }    
}

