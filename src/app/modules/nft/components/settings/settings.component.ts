import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { NftSettingService } from '../../services/nft-setting.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    providers: [],
    selector: 'app-nft-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
  })
  export class NftSettingsComponent implements OnInit {

      wallet: any;
      address: string;
      username: string;
      bio: string;
      email: string;
      modalRef: BsModalRef;

      constructor(
        private localSt: LocalStorage,
        private settingServ: NftSettingService,
        private kanbanServ: KanbanService,
        private toastr: ToastrService,
        private modalServ: BsModalService) {

      }
      ngOnInit() {
        this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

            if(!wallets || !wallets.items || (wallets.items.length == 0)) {
              return;
            }
            const wallet = wallets.items[wallets.currentIndex];
            this.wallet = wallet;
            const addresses = wallet.addresses;
            this.address = addresses.filter(item => item.name == 'FAB')[0].address;
          });            
      }

      save() {
        const initialState = {
            pwdHash: this.wallet.pwdHash,
            encryptedSeed: this.wallet.encryptedSeed
          };          
          
          this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
    
          this.modalRef.content.onCloseFabPrivateKey.subscribe( (privateKey: any) => {
            this.saveDo(privateKey);
          }); 
      }

      saveDo(privateKey: any) {
        let body = {
          username: this.username,
          email: this.email,
          bio: this.bio
        };
        
        const sig = this.kanbanServ.signJsonData(privateKey, body);
        console.log('r=', sig.r);
        console.log('s=', sig.s);
        console.log('v=', sig.v);
        body['sig'] = sig.signature;
        this.settingServ.save(body).subscribe(
          (ret: any) => {
            console.log('ret==', ret);
            if(ret && ret.ok) {
              this.toastr.success('Setting was saved successfully.');
            } else {
              this.toastr.error('Failed to save setting.');
            }
          }
        );
      }
  }
