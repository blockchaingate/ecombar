import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../shared/services/collection.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { MerchantService } from '../../../shared/services/merchant.service';

@Component({
  selector: 'app-admin-main-layout-add',
  providers: [CollectionService],
  templateUrl: './main-layout-add.component.html',
  styleUrls: ['./main-layout-add.component.scss', '../../../../../table.scss']
})
export class MainLayoutAddComponent implements OnInit {
    collections: any;
    constructor(
      private userServ: UserService,
      private merchantServ: MerchantService,
      private router: Router,
      private collectionServ: CollectionService) {
    }    
    ngOnInit() {
      const merchantId = this.merchantServ.id;

      if (this.userServ.isSystemAdmin) {
        this.getAdminCollections();
      } else
        if (merchantId) {
          this.getMerchantCollections(merchantId);
        }
    }

    getMerchantCollections(merchantId: string) {
      this.collectionServ.getMerchantCollections(merchantId).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.collections = res._body;
            console.log('this.collections=', this.collections);
          }
        }
      );
    }
  
    getAdminCollections() {
      this.collectionServ.getAdminCollections().subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.collections = res._body;
          }
        }
      );
    }

    addMainLayout() {

    }
}