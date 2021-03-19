import { Component, OnInit, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-textbox',
    templateUrl: './textbox.component.html',
    styleUrls: ['./textbox.component.scss']
})
export class TextboxComponent implements OnInit {
    name: string;
    @Input() title: string;
    @Input() subtitle: string;
    @Input() placeholder: string;
    ngOnInit() {
          
    }
}