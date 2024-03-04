import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { LogoutModalComponent } from '../logout-modal/logout-modal.component';
import { PasswordModalComponent } from '../password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { WalletService } from '../../services/wallet.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
    providers: [],
    selector: 'app-stores-header',
    templateUrl: './stores-header.component.html',
    styleUrls: ['./stores-header.component.scss']
  })
  export class StoresHeaderComponent implements OnInit {
    showAside: boolean;
    setting: any;
    searchText: string;
    modalRef: BsModalRef;
    wallet: any;
    wallets: any;
    currentWalletIndex: number;

    constructor(
      private localSt: StorageMap, 
      private modalServ: BsModalService,
      private walletServ: WalletService,
      private toastr: ToastrService,
      private translateServ: TranslateService) {}

    ngOnInit() {
        this.showAside = false;    
        this.localSt.get('ecomwallets').subscribe((wallets: any) => {

          if(!wallets || !wallets.items || (wallets.items.length == 0)) {
            return;
          }
          this.wallets = wallets;
          this.currentWalletIndex = wallets.currentIndex;
          const wallet = wallets.items[wallets.currentIndex];
          if(!wallet) {
            return;
          }
          this.wallet = wallet;
          const addresses = wallet.addresses;
          const address = addresses.filter(item => item.name == 'FAB')[0].address;
          if(!address) {
            return;
          }

        });        
    }

    changeLanguage(lang: string) {
      this.translateServ.setDefaultLang(lang);
      this.translateServ.use(lang);
    }
    
    onSearch() {
      console.log('on Search1111');
      console.log('searchText=', this.searchText);
    }

    onKeyDownEvent(event) {
      this.onSearch();
    }

    logout() {
      this.modalRef = this.modalServ.show( LogoutModalComponent );
      this.modalRef.content.onClose.subscribe(
        (op: string) => {
          if(op == 'DELETE') {
            const initialState = {
              pwdHash: this.wallet.pwdHash,
              encryptedSeed: this.wallet.encryptedSeed
            };          
            
            this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
      
            this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
              if (this.currentWalletIndex >= 0 && this.wallets) {
                this.wallets.items.splice(this.currentWalletIndex, 1);
                if(this.wallets.items.length >= 0) {
                  this.wallets.currentIndex = 0;
                  this.wallet = this.wallets.items[0];
                  this.currentWalletIndex = 0;
                } else {
                  this.wallets.currentIndex = -1;
                  this.wallet = null;
                }
              }

              this.walletServ.updateWallets(this.wallets).subscribe((res: any) => {
                console.log('res===', res);
                this.toastr.info(
                  this.translateServ.instant('Your wallet was deleted successfully'),
                  this.translateServ.instant('Ok')); 
              });;              
            });            
          }
        }
      );
    }
  }
