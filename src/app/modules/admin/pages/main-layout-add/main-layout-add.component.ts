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
    mainLayout: any;
    id: string;
    collections: any;
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
              this.mainLayout = res._body;
              const merchantId = this.merchantServ.id;

              console.log('merchantId==', merchantId);
              if (this.userServ.isSystemAdmin) {
                this.getAdminCollections();
              } else
              if (merchantId) {
                this.getMerchantCollections(merchantId);
              }

            }
  
          }
        );
      } else {
        this.mainLayout = {
          type: '',
          sequence: 0,
          col: '',
          cols: []
        }
        const merchantId = this.merchantServ.id;

        console.log('merchantId==', merchantId);
        if (this.userServ.isSystemAdmin) {
          this.getAdminCollections();
        } else
        if (merchantId) {
          this.getMerchantCollections(merchantId);
        }        
      }


    }

    updateCollectionsChecked() {
      
      /*
      for(let i=0;i<this.mainLayout.cols.length;i++) {
        if(this.mainLayout.cols.indexOf(this.collections[i]._id) >= 0) {
          this.collections[i].isChecked = true;
        }
      }
      */
     for(let i = 0; i < this.collections.length; i++) {
       const collection = this.collections[i];
       for(let j = 0; j < this.mainLayout.cols.length; j++) {
         const col = this.mainLayout.cols[j];
         console.log('collection=', collection);
         console.log('col=', col);
         if(col === collection._id) {
           collection.isChecked = true;
         }
       }
     }
      console.log('this.collections after updated=', this.collections);
      
    }
    getMerchantCollections(merchantId: string) {
      this.collectionServ.getMerchantCollections(merchantId).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.collections = res._body;
            console.log('this.collections=', this.collections);
            this.updateCollectionsChecked();
          }
        }
      );
    }
  
    getAdminCollections() {
      this.collectionServ.getAdminCollections().subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.collections = res._body;
            this.updateCollectionsChecked();            
          }
        }
      );
    }

    addMainLayout() {
      
      /*
      {
        type: this.type,
        sequence: this.sequence,
        col: null,
        cols: null
      };

      if(this.type == 'Single Collection') {
        data.col = this.collection;
      } else

      */

     const data = this.mainLayout;
     if(data.type == 'Combo Collection') {
      console.log('this.collections=', this.collections);
      data.cols = this.collections.map(item => {
        if(item.isChecked) {
          return item._id;
        }
      });
      data.cols = data.cols.filter(function( element ) {
        return element !== undefined;
     });
    }      
      
      
      console.log('data=', data);
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