import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-admin-coins-list',
  providers: [],
  templateUrl: './coins-list.component.html',
  styleUrls: ['./coins-list.component.scss', '../../../../../table.scss']
})
export class CoinsListComponent implements OnInit{
    @Input() coins;
    @Output() deposit = new EventEmitter<any>();

    ngOnInit() {

    }

    depositDo(coin) {
      this.deposit.emit(coin);
    }
}