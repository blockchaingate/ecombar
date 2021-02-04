import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../shared/services/collection.service';
import { MainLayoutService } from '../../../shared/services/mainlayout.service';
import { MerchantService } from '../../../shared/services/merchant.service';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-main-layout',
  providers: [CollectionService],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss', '../../../../../table.scss']
})
export class MainLayoutComponent implements OnInit {
    mainLayouts: any;

    constructor(
      private userServ: UserService,
      private router: Router,
      private merchantServ: MerchantService,
      private mainLayoutServ: MainLayoutService,
      private collectionServ: CollectionService) {
    }     
    ngOnInit() {
      const merchantId = this.merchantServ.id;

      if (this.userServ.isSystemAdmin) {
        this.getAdminMainLayouts();
      } else
      if (merchantId) {
        this.getMerchantMainLayouts(merchantId);
      }
    }

    getMerchantMainLayouts(merchantId: string) {
      this.mainLayoutServ.getMerchantMainLayouts(merchantId).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.mainLayouts = res._body;
          }
        }
      );
    }
  
    getAdminMainLayouts() {
      this.mainLayoutServ.getAdminMainLayouts().subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.mainLayouts = res._body;
          }
        }
      );
    }   
    
    editMainLayout(mainLayout) {
      this.router.navigate(['/admin/main-layout/' + mainLayout._id + '/edit']);
    }
  
    deleteMainLayout(mainLayout) {
      this.mainLayoutServ.deleteMainLayout(mainLayout._id).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.mainLayouts = this.mainLayouts.filter((item) => item._id != mainLayout._id);
          }
        }
      );
    }    
}