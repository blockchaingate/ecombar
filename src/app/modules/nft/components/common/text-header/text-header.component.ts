import { Component, OnInit, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-text-header',
    templateUrl: './text-header.component.html',
    styleUrls: ['./text-header.component.scss']
  })
  export class TextHeaderComponent implements OnInit {
    @Input() title: string;
    @Input() subtitle: string;
    @Input() new: boolean;
      ngOnInit() {
          
      }
  }
