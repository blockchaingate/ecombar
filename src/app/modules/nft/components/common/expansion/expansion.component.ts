import { Component, OnInit, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-expansion',
    templateUrl: './expansion.component.html',
    styleUrls: ['./expansion.component.scss']
})
export class ExpansionComponent implements OnInit {
    @Input() options?: any;
    @Input() toggleable: boolean;
    @Input() title: string;
    @Input() icon: string;
    expanded: boolean;
    noBorderTop: boolean;
    ngOnInit() {
       this.expanded = false;   
       this.noBorderTop = false;
       if(this.options) {
            if(this.options.expanded) {
                this.expanded = this.options.expanded;
            }
            if(this.options.noBorderTop) {
                this.noBorderTop = this.options.noBorderTop;
            }            
       }
    }

}