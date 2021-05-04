import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-coins-list',
  providers: [],
  templateUrl: './coins-list.component.html',
  styleUrls: ['./coins-list.component.scss', '../../../../../table.scss']
})
export class CoinsListComponent implements OnInit{
    @Input() coins;
    ngOnInit() {

    }
}