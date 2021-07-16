import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { DataService } from '../shared/services/data.service';
import { StoreService } from '../shared/services/store.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit{

  constructor(
    private dataServ: DataService,
    private storeServ: StoreService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) =>  {
      const storeId = params.get('storeId');
      if(storeId) {
        this.dataServ.changeStoreId(storeId);
        this.storeServ.getStore(storeId).subscribe(
          (ret: any) => {
            if(ret && ret.ok) {
              const store = ret._body;
              this.dataServ.changeStore(store);
              const owner = store.owner;
              this.dataServ.changeStoreOwner(owner);
            }
          }
        );
      }
      
    });
    /*
    this.route.paramMap.subscribe((params: ParamMap) =>  {
      const id = params.get('id');   
      console.log('id======', id);
      this.storeServ.getStore(id).subscribe(
        (ret: any) => {
          if(ret && ret.ok) {
            const store = ret._body;
            this.dataServ.changeStore(store);
            const owner = store.owner;
            this.dataServ.changeStoreOwner(owner);
          }
        }
      );
    });
    */
  }
}
