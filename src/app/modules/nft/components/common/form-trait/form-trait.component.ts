import { Component, OnInit, Input } from '@angular/core';

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
    ngOnInit() {
          
    }
}