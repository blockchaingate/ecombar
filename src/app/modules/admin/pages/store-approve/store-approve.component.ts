import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../../shared/services/store.service';

@Component({
  selector: 'app-store-approve',
  templateUrl: './store-approve.component.html',
  styleUrls: ['./store-approve.component.scss']
})
export class StoreApproveComponent implements OnInit {

  store: any;
  constructor(
    private route: ActivatedRoute,
    private storeServ: StoreService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('id=', id);
    if (id) {
      this.storeServ.getStore(id).subscribe(
        (ret: any) => {
          console.log('ret==', ret);
          if(ret && ret.ok) {
            this.store = ret._body;
          }
        }
      );
    }
  }

  approve() {

  }
}
