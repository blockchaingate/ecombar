import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SearchComponent as ParentSearchComponent } from 'src/app/modules/store/search/search.component';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent extends ParentSearchComponent{}
