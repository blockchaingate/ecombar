import { Component, OnInit, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-properties-list',
    templateUrl: './properties-list.component.html',
    styleUrls: ['./properties-list.component.scss']
  })
  export class NftPropertiesListComponent implements OnInit {
      @Input() properties: any;
      ngOnInit() {
          
      }
  }
