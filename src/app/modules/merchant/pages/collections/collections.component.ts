import { Component, OnInit } from '@angular/core';
import { CollectionService } from 'src/app/modules/shared/services/collection.service';
import { Router } from '@angular/router';
import { MerchantService } from 'src/app/modules/shared/services/merchant.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  selector: 'app-admin-collections',
  providers: [CollectionService],
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss', '../../../../../table.scss']
})
export class CollectionsComponent implements OnInit {
  collections: any;
  wallet: any;
  modalRef: BsModalRef;

  constructor(
    public kanbanServ: KanbanService,
    private modalService: BsModalService,
    private dataServ: DataService,
    private storageServ: StorageService,
    private merchantServ: MerchantService,
    private router: Router,
    private collectionServ: CollectionService) {
  }

  ngOnInit() {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.getMerchantCollections(walletAddress);
        }
      }
    );
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );  
  }

  getMerchantCollections(walletAddress: string) {
    this.collectionServ.getMerchantCollections(walletAddress, 100, 0).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.collections = res._body;
        }
      }
    );
  }

  editCollection(collection) {
    this.router.navigate(['/merchant/collection/' + collection._id + '/edit']);
  }

  deleteCollection(collection_id: string) {

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
      this.deleteCollectionDo(privateKey, collection_id);
    });
  }

  deleteCollectionDo(privateKey: any, collection_id: string) {
    const data = {
      id: collection_id
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;        
    this.collectionServ.deleteCollection(data).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.collections = this.collections.filter((item) => item._id != collection_id);
        }
      }
    );
  }

}