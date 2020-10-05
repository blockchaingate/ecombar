import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../shared/services/collection.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-admin-collections',
  providers: [CollectionService],
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss', '../../../../../table.scss', '../../../../../button.scss']
})
export class CollectionsComponent implements OnInit{
    collections: any;
    constructor(
      private userServ: UserService,
      private router: Router,
      private collectionServ: CollectionService) {
    }

    ngOnInit() {
      this.userServ.getToken().subscribe(
        (token: any) => {
          const decoded = this.userServ.decodeToken(token);
          const aud = decoded.aud;
          const merchantId = decoded.merchantId;
  
          if (aud == 'isSystemAdmin') {
            this.getAdminCollections();
          }  else 
          if (merchantId) {
            this.getMerchantCollections(merchantId);
          }
        } 
      );
    }

    getMerchantCollections(merchantId: string) {
      this.collectionServ.getMerchantCollections(merchantId).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.collections = res._body;
          }
        }
      );
    }  
  
    getAdminCollections() {
      this.collectionServ.getAdminCollections().subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.collections = res._body;
          }
        }
      );
    }
  
    edit(collection) {
      this.router.navigate(['/admin/collection/' + collection._id + '/edit']);
    }

}