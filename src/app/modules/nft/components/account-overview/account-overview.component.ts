import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NftSettingService } from '../../services/nft-setting.service';
import { UploadService } from '../../services/upload.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    providers: [],
    selector: 'app-nft-account-overview',
    templateUrl: './account-overview.component.html',
    styleUrls: ['./account-overview.component.scss']
  })
  export class NftAccountOverviewComponent implements OnInit {
    @Input() address: string;
    @Input() wallet: any;
    @Input() self: boolean;

    logo: String;
    banner: String;
    username: string;
    modalRef: BsModalRef;

    constructor(
      private uploadServ: UploadService, 
      private modalServ: BsModalService,
      private kanbanServ: KanbanService,
      private toastr: ToastrService,
      private settingServ: NftSettingService) {}
    ngOnInit() {
      this.settingServ.get(this.address).subscribe(
        (ret: any) => {
          console.log('ret=', ret);
          if (ret && ret.ok) {
            const setting = ret._body;
            this.logo = setting.logo;
            this.banner = setting.banner;
            this.username = setting.username;
          }
        }
      );          
    }

    fileBannerChange(event) {

      this.fileUpload(event, 'banner');
    }  

    fileLogoChange(event) {
      this.fileUpload(event, 'logo');
    }  

    fileUpload(event, type: string) {
      let fileList: FileList = event.target.files;
      if(fileList.length > 0) {
          let file: File = fileList[0];
          this.uploadServ.uploadFile('s3/nft/upload', file).subscribe(
            (res: any) => {
              console.log('res for upload file=', res);
              if(res && res.ok) {
                if(type == 'banner') {
                  this.banner = res.data;
                } else
                if(type == 'logo') {
                  this.logo = res.data;
                }
 
                const initialState = {
                  pwdHash: this.wallet.pwdHash,
                  encryptedSeed: this.wallet.encryptedSeed
                };          
                
                this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
          
                this.modalRef.content.onCloseFabPrivateKey.subscribe( (privateKey: any) => {
                  this.saveDo(privateKey);
                });                 
              }
            }
          );
      }
    }

    saveDo(privateKey: any) {
      let body = {};
      
      if(this.banner) {
        body['banner'] = this.banner
      }

      if(this.logo) {
        body['logo'] = this.logo
      }
      const sig = this.kanbanServ.signJsonData(privateKey, body);

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