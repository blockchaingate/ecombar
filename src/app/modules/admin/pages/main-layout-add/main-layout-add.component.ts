import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../shared/services/collection.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { MainLayoutService } from '../../../shared/services/mainlayout.service';
import { MerchantService } from '../../../shared/services/merchant.service';

@Component({
  selector: 'app-admin-main-layout-add',
  providers: [CollectionService],
  templateUrl: './main-layout-add.component.html',
  styleUrls: ['./main-layout-add.component.scss', '../../../../../table.scss']
})
export class MainLayoutAddComponent implements OnInit {
    collections: any;
    collection: string;
    type: string;
    sequence: number;
    id: string;
    constructor(
      private userServ: UserService,
      private merchantServ: MerchantService,
      private router: Router,
      private route: ActivatedRoute,
      private mainLayoutServ: MainLayoutService,
      private collectionServ: CollectionService) {
    }    
    ngOnInit() {
      this.id = this.route.snapshot.paramMap.get('id');

      if (this.id) {
        this.mainLayoutServ.getMainLayout(this.id).subscribe(
          (res: any) => {
            console.log('ressssss=', res);
            if (res && res.ok) {
              const mainLayout = res._body;
              this.type = mainLayout.type;
              this.sequence = mainLayout.sequence;
              if(mainLayout.type == 'Single Collection') {
                this.collection = mainLayout.content;
              }
            }
  
          }
        );
      }

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
      const data = {
        type: this.type,
        sequence: this.sequence,
        content: null
      };

      if(this.type == 'Single Collection') {
        data.content = this.collection;
      }
      if (!this.id) {
  
        this.mainLayoutServ.create(data).subscribe(
          (res: any) => {
            if (res && res.ok) {
              this.router.navigate(['/admin/main-layout']);
            }
          }
        );
      } else {
        this.mainLayoutServ.update(this.id, data).subscribe(
          (res: any) => {
            if (res && res.ok) {
              this.router.navigate(['/admin/main-layout']);
            }
          }
        );
      }
    }
}