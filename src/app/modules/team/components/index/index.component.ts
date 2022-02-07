import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { StarService } from 'src/app/modules/shared/services/star.service';
import { StoreService } from 'src/app/modules/shared/services/store.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/modules/shared/services/storage.service';

@Component({
  selector: 'app-team-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class TeamIndexComponent implements OnInit {
  stores: any;
  wallet: any;
  rewards: any;
  walletAddress: string;
  parentId: string;
  downlines: any;
  modalRef: BsModalRef;
  isValidMember: boolean;
  currentUrl: string;

  constructor(
    private dataServ: DataService,
    private starServ: StarService,
    private toastr: ToastrService,
    private storeageServ: StorageService,
    private route: ActivatedRoute,
    public kanbanServ: KanbanService,
    private modalService: BsModalService,
    private storeServ: StoreService) { }

  getDownlines(address: string) {
    this.starServ.getRefCustomers(address).subscribe(
      (ret: any) => {
        console.log('ret for getRefCustomers=', ret);
        this.downlines = ret.map(item => item.id);
      }
    );
  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(
      (map: any) => {
        if(map && map.params && map.params.ref) {
          const refAddress = map.params.ref;
          this.storeageServ.storeRef(refAddress);
          
        }
        
      }
    );

    this.storeageServ.getStoreRef().subscribe(
      (refAddress: string) => {
        if(refAddress) {
          this.parentId = refAddress;
        }
      }
    );
    this.currentUrl = window.location.href;
    this.isValidMember = true;
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.walletAddress = walletAddress;
          this.getDownlines(walletAddress);
          this.starServ.isValidMember(walletAddress).subscribe(
            (ret: any) => {
              this.isValidMember = ret.isValid;
            }
          );

          this.starServ.getLockers(walletAddress).subscribe(
            (resp) => {
              //console.log('resp for rewards=', resp);
              if(resp && resp.ok) {
                this.rewards = resp._body;
              }
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
    if(this.parentId == this.walletAddress) {
      this.toastr.info('You cannot refer yourself.');
      return;
    }
    this.starServ.isValidMember(this.parentId).subscribe(
      (ret: any) => {
        if(ret && ret.isValid) {
          const initialState = {
            pwdHash: this.wallet.pwdHash,
            encryptedSeed: this.wallet.encryptedSeed
          };          
          
          this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
      
          this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
            this.joinAsMemberDo(privateKey);
          }); 
        } else {
          this.toastr.error('Invalid referral code.');
        }
      }
    );

   
  }

  getRefLink() {
    let link = this.currentUrl + '?ref=' + this.walletAddress;
    return link;
  }

  joinAsMemberDo(privateKey: any) {
    const data = {
      parentId: this.parentId
    };

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
}
