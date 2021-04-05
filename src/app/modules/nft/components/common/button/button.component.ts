import { Component, OnInit, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
    @Input() type: string;
    @Input() name: string;
    ngOnInit() {
          
    }

    action() {

    }
}