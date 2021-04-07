import { Component, OnInit, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-expansion',
    templateUrl: './expansion.component.html',
    styleUrls: ['./expansion.component.scss']
})
export class ExpansionComponent implements OnInit {
    @Input() toggleable: boolean;
    @Input() title: string;
    @Input() icon: string;
    expanded: boolean;
    ngOnInit() {
       this.expanded = false;   
    }

}