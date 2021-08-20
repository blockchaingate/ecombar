import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-top-category-banners',
  providers: [],
  templateUrl: './top-category-banners.component.html',
  styleUrls: ['./top-category-banners.component.scss']
})
export class TopCategoryBannersComponent implements OnInit {
  storeId: string;
  @Input() banners: any;
  errMsg = '';

  ngOnInit() {
      
  }
}