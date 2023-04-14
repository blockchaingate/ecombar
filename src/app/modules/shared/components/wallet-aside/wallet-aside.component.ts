import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { env } from 'process';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { environment } from 'src/environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
// import { NgxSpinnerService } from "ngx-bootstrap-spinner";  // 只支持到 @angular/common@^10.0.0
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
// import { NftPortService } from 'src/app/modules/nft/services/nft-port.service';

@Component({
    providers: [],
    selector: 'app-wallet-aside',
    templateUrl: './wallet-aside.component.html',
    styleUrls: ['./wallet-aside.component.scss']
  })
  export class NftWalletAsideComponent implements OnInit {
      wallet: any;
      wallets: any;
      assets: any;
      address: string;
      modalRef: BsModalRef;
      isProxyAuthenticated: boolean;
      constructor(
          private route: Router, 
          // private spinner: NgxSpinnerService,
          private utilServ: UtilService,
          private modalServ: BsModalService,
          // private nftPortServ: NftPortService,
          private kanbanServ: KanbanService,
          private kanbanSmartContractServ: KanbanSmartContractService,
          private localSt: LocalStorage) {}
      ngOnInit() {
          this.isProxyAuthenticated = true;
        this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {
            if(!wallets || !wallets.items || (wallets.items.length == 0)) {
              return;
            }
            this.wallets = wallets;
            const wallet = wallets.items[wallets.currentIndex];
            this.wallet = wallet;
            this.changeWallet(this.wallet.id);
        });           
      }

      changeWalletEvent( event: Event ) {  // walltId: string
        // error TS2339: Property 'value' does not exist on type 'void'.
        const target = event.target as HTMLInputElement;
        const value = target.value;
        const walltId = value;  // walltId: string
        this.changeWallet(walltId);
      }

      changeWallet( walltId: string ) {
        console.log('walletId=', walltId);
          let index = -1;
          for(let i = 0; i < this.wallets.items.length; i++) {
              const item = this.wallets.items[i];
              if(item.id == walltId) {
                  index = i;
                this.wallet = item;
                break;
              }
          }
          //this.wallet = this.wallets.items.filter(item => item.id == walltId)[0];
          const addresses = this.wallet.addresses;

          this.address = addresses.filter(item => item.name == 'FAB')[0].address;     
          console.log('this.address=', this.address);

          // this.nftPortServ.isProxyAuthenticated(this.address).subscribe(  // 涉及 NFT，先注释
          //   ret => {
          //     this.isProxyAuthenticated = ret;
          //     console.log('this.isProxyAuthenticated=', this.isProxyAuthenticated);
          //   }
          // );  

          const kanbanAddress = this.utilServ.fabToExgAddress(this.address);

          this.wallets.currentIndex = index;
          this.localSt.setItem('ecomwallets', this.wallets).subscribe(() => {
          });  
          
          this.kanbanServ.getExchangeBalance(kanbanAddress).subscribe(
            (resp: any) => {
                this.assets = resp;
                console.log('this.assets=', this.assets);
            },
            error => {
                // console.log('errorrrr=', error);
            }
        );


      } 

      createWallet() {
        this.route.navigate(['/wallet/create-wallet']);
      }
  
      restoreWallet() {
        this.route.navigate(['/wallet/import-wallet']);
      }   
      
      getCoinName(coinType) {
          return this.utilServ.getCoinNameByTypeId(coinType);
      }

      getCoinAmount(amount) {
          return this.utilServ.toNumber(this.utilServ.showAmount(amount, 18));
      }
  }

