import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { StoreService } from '../../../shared/services/store.service';

@Component({
  selector: 'app-store-approve',
  templateUrl: './store-approve.component.html',
  styleUrls: ['./store-approve.component.scss']
})
export class StoreApproveComponent implements OnInit {
  coinpoolAddress: string;
  store: any;
  constructor(
    private route: ActivatedRoute,
    private kanbanServ: KanbanService,
    private storeServ: StoreService) { }

  async ngOnInit() {
    this.coinpoolAddress = await this.kanbanServ.getCoinPoolAddress();
    console.log('coinpoolAddress==', this.coinpoolAddress);
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
