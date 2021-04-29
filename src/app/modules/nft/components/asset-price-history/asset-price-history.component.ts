import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-asset-price-history',
    templateUrl: './asset-price-history.component.html',
    styleUrls: ['./asset-price-history.component.scss']
  })
  export class NftAssetPriceHistoryComponent implements OnInit {
    @Input()  sales: any;

    // data goes here
    multi = [
        {
          "name": "Germany",
          "series": [
            {
              "name": "1990",
              "value": 62000000
            },
            {
              "name": "2010",
              "value": 73000000
            },
            {
              "name": "2011",
              "value": 89400000
            }
          ]
        }
    ];

    ngOnInit() {
  
    }
    title = 'Price history';

    view: any[] = [600, 400];

    // options
    legend: boolean = true;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Time';
    yAxisLabel: string = 'Price';
    timeline: boolean = true;
  
    colorScheme = {
      domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };
  
    constructor() {
    }
  
    onSelect(data): void {
      console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }
  
    onActivate(data): void {
      console.log('Activate', JSON.parse(JSON.stringify(data)));
    }
  
    onDeactivate(data): void {
      console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }
  

  
  }
