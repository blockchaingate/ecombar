import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { StoreService } from 'src/app/modules/shared/services/store.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-profile',
  providers: [],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  modalRef: BsModalRef;
  phone: string;
  address: string;
  facebook: string;
  google: string;
  twitter: string;
  github: string;
  wallet: any;
  id: string;

  constructor(
    private storeServ: StoreService,
    private dataServ: DataService,
    private toastr: ToastrService,
    public kanbanServ: KanbanService,
    private modalService: BsModalService) {
  }

  ngOnInit() {
    this.dataServ.currentWallet.subscribe(
      (wallet: string) => {
        this.wallet = wallet;
      }
    ); 

    this.dataServ.currentMyStore.subscribe(
      (store: any) => {

        if(store) {
          console.log('store===', store);
          this.id = store._id;
          this.phone = store.phone;
          this.address = store.address;
          this.facebook = store.facebook;
          this.google = store.google;
          this.twitter = store.twitter;
          this.github = store.github;
        }
      }
    );
    /*
    this.userServ.getMe().subscribe(
      (res: any) => {
        if(res && res.ok) {
          const data = res._body;
          this.displayName = data.displayName;
          
          if(data.myPhotoUrl) {
            this.images.push(data.myPhotoUrl); 
          }
          console.log('data=', data);
        }
      }
    );
    */
  }

  update() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
      this.updateDo(privateKey);
    });
  }

  updateDo(privateKey: any) {
    const data = {
      phone: this.phone,
      address: this.address,
      facebook: this.facebook,
      google: this.google,
      twitter: this.twitter,
      github: this.github
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.storeServ.update(this.id, data).subscribe(
      async (res: any) => {
        if (res.ok) {
          this.toastr.success('Profile was updated successfully.');
        } else {
          this.toastr.error('Failed to update profile.');
        }
      }    
    );
  }
}