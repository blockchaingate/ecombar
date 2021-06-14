import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../shared/services/store.service';
import { DataService } from '../../../shared/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stores',
  providers: [StoreService],
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss', '../../../../../table.scss']
})
export class StoresComponent implements OnInit {
  stores: any;
  address: string;
  constructor(
    private router: Router,
    private dataServ: DataService,
    private storeServ: StoreService) {

  }

  ngOnInit() {
    this.dataServ.currentWalletAddress.subscribe(
      (address: string) => {
        this.address = address;
        this.getStores(address);
      }
    );
    
  }
  getStores(address) {

    this.storeServ.getStoresByAddress(address).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.stores = res._body;
        }
      }
    );
  }

  editBrand(store) {
    this.router.navigate(['/admin/store/' + store._id + '/edit']);
  }

  deleteStore(store) {
    this.storeServ.deleteStore(store._id).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.stores = this.stores.filter((item) => item._id != store._id);
        }
      }
    );
  }
}
