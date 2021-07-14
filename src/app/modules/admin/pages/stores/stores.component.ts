import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../shared/services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {

  stores: any;
  constructor(
    private router: Router,
    private storeServ: StoreService) { }

  ngOnInit(): void {
    this.storeServ.getAll().subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.stores = ret._body;
        }
      }
    );
  }

  approved(store_id: string) {
    this.router.navigate(['/admin/store/' + store_id + '/approve']);
  }
}
