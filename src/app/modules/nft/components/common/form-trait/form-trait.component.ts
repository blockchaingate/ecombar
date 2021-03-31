import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PropertiesComponent } from './modals/properties/properties.component';
@Component({
    providers: [],
    selector: 'app-form-trait',
    templateUrl: './form-trait.component.html',
    styleUrls: ['./form-trait.component.scss']
})
export class FormTraitComponent implements OnInit {
    @Input() icon: string;
    @Input() title: string;
    @Input() subtitle: string;
    modalRef: BsModalRef;
    //@Output() newItemEvent = new EventEmitter<string>();

    constructor(private modalService: BsModalService) {}
    
    ngOnInit() {
          
    }

    addPopup(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(PropertiesComponent);
    }
}