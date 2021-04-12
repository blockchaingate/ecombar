import { Component, Input, OnInit } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-levels-list',
    templateUrl: './levels-list.component.html',
    styleUrls: ['./levels-list.component.scss']
  })
  export class NftLevelsListComponent implements OnInit {
      @Input() levels: any;
      ngOnInit() {
          
      }
  }
