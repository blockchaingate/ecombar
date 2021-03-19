import { Component, OnInit, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-textarea-switch',
    templateUrl: './textarea-switch.component.html',
    styleUrls: ['./textarea-switch.component.scss']
})
export class TextareaSwitchComponent implements OnInit {
    unlocked: boolean;
    name: string;
    @Input() title: string;
    @Input() subtitle: string;
    @Input() placeholder: string;
    ngOnInit() {
          this.unlocked = false;
    }
    switch() {
        console.log('switch it');
        this.unlocked = !this.unlocked;
        console.log('unlocked=', this.unlocked);
    }
}