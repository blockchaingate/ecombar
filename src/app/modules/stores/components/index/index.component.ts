import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/modules/shared/services/store.service';

@Component({
  selector: 'app-stores-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class StoresIndexComponent implements OnInit {

  constructor(private storeServ: StoreService) { }

  ngOnInit(): void {
    this.storeServ.getStores().subscribe(
      (ret: any) => {
        console.log('ret==', ret);
      }
    );
  }

}
