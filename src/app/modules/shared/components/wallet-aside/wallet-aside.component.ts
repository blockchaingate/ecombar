import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

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
          private utilServ: UtilService,
          private kanbanServ: KanbanService,
          private localSt: StorageMap) {}
      ngOnInit() {
          this.isProxyAuthenticated = true;
        this.localSt.get('ecomwallets').subscribe((wallets: any) => {
            if(!wallets || !wallets.items || (wallets.items.length == 0)) {
              return;
            }
            this.wallets = wallets;
            const wallet = wallets.items[wallets.currentIndex];
            this.wallet = wallet;
            this.changeWallet(this.wallet.id);
        });           
      }

      authenticate() {

      }

      changeWalletEvent(event: any) {
        return this.changeWallet(event.target.value);
      }
      changeWallet(walltId: string) {
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

          const kanbanAddress = this.utilServ.fabToExgAddress(this.address);

          this.wallets.currentIndex = index;
          this.localSt.set('ecomwallets', this.wallets).subscribe(() => {
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

