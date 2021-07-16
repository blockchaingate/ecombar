import { Component, Input, OnInit } from '@angular/core';
import { CollectionService } from '../../../../shared/services/collection.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-top-categories',
  providers: [],
  templateUrl: './top-categories.component.html',
  styleUrls: ['./top-categories.component.scss']
})
export class TopCategoriesComponent implements OnInit {
  storeId: string;
  @Input() categories: any;
  errMsg = '';

  ngOnInit() {
      
  }
}