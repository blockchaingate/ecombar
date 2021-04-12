import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LevelsComponent } from './modals/levels/levels.component';
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
    @Input() modal: any;
    modalRef: BsModalRef;
    @Output() save = new EventEmitter<any>();

    constructor(private modalService: BsModalService) {}
    
    ngOnInit() {
          
    }

    addPopup() {
        const initialState = {
            title: this.modal.title,
            subtitle: this.modal.subtitle,
            data: this.modal.data
        };    

        if(this.modal.type == 'properties') {
          
            this.modalRef = this.modalService.show(PropertiesComponent, {initialState});
        } else {
            this.modalRef = this.modalService.show(LevelsComponent, {initialState});
        }
        
        this.modalRef.onHide.subscribe((modalContainerComponent : any) => {
            console.log('data in onHide=', modalContainerComponent.initialState.data);
            this.save.emit(modalContainerComponent.initialState.data);
        });
    }
}