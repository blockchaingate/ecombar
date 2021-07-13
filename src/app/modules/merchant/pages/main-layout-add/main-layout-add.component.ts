import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../shared/services/collection.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { MainLayoutService } from '../../../shared/services/mainlayout.service';
import { MerchantService } from '../../../shared/services/merchant.service';
import { StorageService } from '../../../shared/services/storage.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
    modalRef: BsModalRef;
    wallet: any;
    constructor(
      private storageServ: StorageService,
      private dataServ: DataService,
      private merchantServ: MerchantService,
      private router: Router,
      public kanbanServ: KanbanService,
      private route: ActivatedRoute,
      private modalService: BsModalService,
      private mainLayoutServ: MainLayoutService,
      private collectionServ: CollectionService) {
    }    
    ngOnInit() {
      this.collections = [];
      this.id = this.route.snapshot.paramMap.get('id');

      this.dataServ.currentWallet.subscribe(
        (wallet: string) => {
          this.wallet = wallet;
        }
      );     
      if (this.id) {
        this.mainLayoutServ.getMainLayout(this.id).subscribe(
          (res: any) => {
            console.log('ressssss=', res);
            if (res && res.ok) {
              this.mainLayout = res._body;
              const merchantId = this.merchantServ.id;


              this.storageServ.checkSystemAdmin().subscribe(
                (ret) => {
                  if (ret) {
                    this.getAdminCollections();
                  } else
                  if (merchantId) {
                    this.getMerchantCollections(merchantId);
                  }
                }
              );


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
        this.storageServ.checkSystemAdmin().subscribe(
          (ret) => {
            if (ret) {
              this.getAdminCollections();
            } else
            if (merchantId) {
              this.getMerchantCollections(merchantId);
            }
          }
        );      
      }


    }

    updateCollectionsChecked() {

     for(let i = 0; i < this.collections.length; i++) {
       const collection = this.collections[i];
       if(this.mainLayout) {
        for(let j = 0; j < this.mainLayout.cols.length; j++) {
          const col = this.mainLayout.cols[j];
          console.log('collection=', collection);
          console.log('col=', col);
          if(col === collection._id) {
            collection.isChecked = true;
          }
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

    addMainLayoutDo(privateKey: any) {
      const data = {
        type: this.mainLayout.type,
        sequence: this.mainLayout.sequence,
        col: this.mainLayout.col,
        cols: this.mainLayout.cols
      };
      //data.owner = this.walletAddress;
      if(data.type == 'Combo Collection') {
       data.cols = this.collections.map(item => {
         if(item.isChecked) {
           return item._id;
         }
       });
       data.cols = data.cols.filter(function( element ) {
         return element !== undefined;
      });
     }      
       
     if(!data.col || data.col.length == 0) {
       delete data.col;
     }
 
     const sig = this.kanbanServ.signJsonData(privateKey, data);
     data['sig'] = sig.signature;     
 
       if (!this.id) {
   
         this.mainLayoutServ.create(data).subscribe(
           (res: any) => {
             if (res && res.ok) {
               this.router.navigate(['/merchant/main-layout']);
             }
           }
         );
       } else {
         this.mainLayoutServ.update(this.id, data).subscribe(
           (res: any) => {
             if (res && res.ok) {
               this.router.navigate(['/merchant/main-layout']);
             }
           }
         );
       }
    }

    addMainLayout() {

      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
        this.addMainLayoutDo(privateKey);
      });
    }


}