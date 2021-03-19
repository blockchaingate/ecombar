import { Component, OnInit, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {
    name: string;
    @Input() title: string;
    @Input() subtitle: string;
    @Input() placeholder: string;
    ngOnInit() {
          
    }
}