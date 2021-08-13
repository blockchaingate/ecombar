import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { StarService } from 'src/app/modules/shared/services/star.service';
import { StoreService } from 'src/app/modules/shared/services/store.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stores-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class StoresIndexComponent implements OnInit {
  stores: any;
  wallet: any;
  parentId: string;
  walletAddress: string;
  modalRef: BsModalRef;
  isValidMember: boolean;

  constructor(
    private dataServ: DataService,
    private starServ: StarService,
    private storeageServ: StorageService,
    private toastr: ToastrService,
    private router: Router,
    public kanbanServ: KanbanService,
    private modalService: BsModalService,
    private storeServ: StoreService) { }

  ngOnInit(): void {
    console.log('stores here we go');
    this.storeageServ.getStoreRef().subscribe(
      (refAddress: string) => {
        this.parentId = refAddress;
      }
    );

    this.isValidMember = true;
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.walletAddress = walletAddress;
          this.starServ.isValidMember(walletAddress).subscribe(
            (ret: any) => {
              this.isValidMember = ret.isValid;
            }
          );
        }
      }
    );

    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );
    this.storeServ.getStores().subscribe(
      (ret: any) => {
        console.log('ret==', ret);
        if(ret && ret.ok) {
          this.stores = ret._body;
        }
      }
    );
  }

  joinAsMember() {
    this.starServ.isValidMember(this.parentId).subscribe(
      (ret: any) => {
        if(ret && ret.isValid) {
          const initialState = {
            pwdHash: this.wallet.pwdHash,
            gas: 0,
            encryptedSeed: this.wallet.encryptedSeed
          };          
          
          this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
      
          this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
            this.joinAsMemberDo(privateKey);
          }); 
        } else {
          this.toastr.error('ref address is not registered.');
        }
      }
    );

   
  }

  joinAsMemberDo(privateKey: any) {
    const data = {
      parentId: this.parentId
    };
    if(this.parentId == this.walletAddress) {
      this.toastr.info('You cannot refer yourself.');
      return;
    }
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature; 
    this.starServ.createRef(data).subscribe(
      (ret: any) => {
        if(ret && ret._id) {
          this.isValidMember = true;
        }
      }
    );    
  }

  gotoStore(store) {
    this.router.navigate(['/store/' + store._id]);
  }
}
