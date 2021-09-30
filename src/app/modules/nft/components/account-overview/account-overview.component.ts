import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NftSettingService } from '../../services/nft-setting.service';
import { UploadService, DocType } from '../../../shared/services/upload.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from 'src/app/modules/shared/services/util.service';

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

    url = '';
    logo: String;
    banner: String;
    username: string;
    modalRef: BsModalRef;
    successMsg = '';
    errMsg = '';
    uploadSuccess = false;

    constructor(
      private uploadService: UploadService, 
      private modalServ: BsModalService,
      private kanbanServ: KanbanService,
      private utilServ: UtilService,
      private toastr: ToastrService,
      private settingServ: NftSettingService) {}
    ngOnInit() {
      this.settingServ.get(this.address).subscribe(
        (ret: any) => {
          console.log('ret=', ret);
          if (ret && ret.ok) {
            const setting = ret._body;
            if(setting) {
              this.logo = setting.logo;
              this.banner = setting.banner;
              this.username = setting.username;
            }

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
          const fileName = file.name;
          const fileType = file.type;
          if(!this.username) {
            this.username = 'account_' + fileName;
          }
          this.uploadService.applyPresignedUrl(fileName, fileType, DocType.PRODUCT, this.username).subscribe(
            ret => {
              const signedUrl = ret.signed_request;
              this.url = ret.url;
              this.uploadService.uploadFileToSignedUrl(signedUrl, file.type, file).subscribe(
                retn => {
                  if(type == 'banner') {
                    this.banner = this.url;
                  } else
                  if(type == 'logo') {
                    this.logo = this.url;
                  }
  
                  const initialState = {
                    pwdHash: this.wallet.pwdHash,
                    encryptedSeed: this.wallet.encryptedSeed
                  };          
                  
                  this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
            
                  this.modalRef.content.onCloseFabPrivateKey.subscribe( (privateKey: any) => {
                    this.saveDo(privateKey);
                  });                 
      
                  this.successMsg = 'Uploaded'; this.uploadSuccess = true;
                },
                err => { this.errMsg = 'Error in uploading.'; });
            },
            error => this.errMsg = 'Error happened during apply presigned url.'
          );

/*
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
*/

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

    shared() {
      const url = 'https://collectiongala.com' + '/nft/accounts/' + this.address;
      this.utilServ.copy(url);
      this.toastr.info('Your link was copied');
    }
  }