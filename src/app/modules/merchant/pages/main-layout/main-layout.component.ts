import { Component, OnInit } from '@angular/core';
import { CollectionService } from 'src/app/modules/shared/services/collection.service';
import { MainLayoutService } from 'src/app/modules/shared/services/mainlayout.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { Router } from '@angular/router';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';

@Component({
  selector: 'app-admin-main-layout',
  providers: [CollectionService],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss', '../../../../../table.scss']
})
export class MainLayoutComponent implements OnInit {
    mainLayouts: any;
    wallet: any;
    modalRef: BsModalRef;

    constructor(
      private dataServ: DataService,
      public kanbanServ: KanbanService,
      private modalService: BsModalService,
      private router: Router,
      private mainLayoutServ: MainLayoutService) {
    }     
    ngOnInit() {
      this.dataServ.currentWalletAddress.subscribe(
        (walletAddress: string) => {
          
          if(walletAddress) {
            this.getMerchantMainLayouts(walletAddress);
          }
          
        }
      );

      this.dataServ.currentWallet.subscribe(
        (wallet: string) => {
          this.wallet = wallet;
        }
      );        
    }

    getMerchantMainLayouts(walletAddress: string) {
      this.mainLayoutServ.getMerchantMainLayouts(walletAddress).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.mainLayouts = res._body;
          }
        }
      );
    }

    editMainLayout(mainLayout) {
      this.router.navigate(['/merchant/main-layout/' + mainLayout._id + '/edit']);
    }
  
    deleteMainLayout(mainLayout_id: string) {

      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
        this.deleteMainLayoutDo(privateKey, mainLayout_id);
      });


    }  
    
    deleteMainLayoutDo(privateKey: any, mainLayout_id: string) {
      const data = {
        id: mainLayout_id
      };
      const sig = this.kanbanServ.signJsonData(privateKey, data);
      data['sig'] = sig.signature;        
      this.mainLayoutServ.deleteMainLayout(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.mainLayouts = this.mainLayouts.filter((item) => item._id != mainLayout_id);
          }
        }
      );
    }
} 