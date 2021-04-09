import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-textbox',
    templateUrl: './textbox.component.html',
    styleUrls: ['./textbox.component.scss']
})
export class TextboxComponent implements OnInit {
    /**
     * Holds the current value of the slider
     */
    @Input() inputValue: string = "";

    /**
     * Invoked when the model has been changed
     */
    @Output() inputValueChange: EventEmitter<string> = new EventEmitter<string>();


    @Input() title: string;
    @Input() subtitle: string;
    @Input() placeholder: string;

    
    ngOnInit() {
          
    }
}