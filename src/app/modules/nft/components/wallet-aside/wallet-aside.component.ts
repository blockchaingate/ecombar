import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { env } from 'process';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { environment } from 'src/environments/environment';
import { NftPortService } from '../../services/nft-port.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';

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
          private spinner: NgxSpinnerService,
          private nftPortServ: NftPortService,
          private utilServ: UtilService,
          private modalServ: BsModalService,
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

      changeWallet(walltId: string) {
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
          
          this.nftPortServ.isProxyAuthenticated(this.address).subscribe(
            ret => {
              this.isProxyAuthenticated = ret;
            }
          );
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

      async authenticateDo(seed: Buffer) {
        const {abi, args} = this.nftPortServ.getRegisterProxyAbiArgs();
        const resp = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.ProxyRegistry, abi, args);
        console.log('resp===', resp);

        if (resp && resp.transactionHash) {
            const txid = resp.transactionHash;
            console.log('txid=', resp.transactionHash);
            var that = this;
            var myInterval = setInterval(function(){ 
              that.kanbanSmartContractServ.getTransactionReceipt(txid).subscribe(
                (receipt: any) => {
                  if(receipt && receipt.transactionReceipt) {
                    clearInterval(myInterval);
                    that.spinner.hide();
                    that.isProxyAuthenticated = true;
                    console.log('receipt.transactionReceipt==', receipt.transactionReceipt);
                  }
                }
              );
            }, 1000);
        }

      }

      authenticate() {
        const initialState = {
            pwdHash: this.wallet.pwdHash,
            encryptedSeed: this.wallet.encryptedSeed
          };          
          
          this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
    
          this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
            this.spinner.show();
            this.authenticateDo(seed);
          });          
      }

      createWallet() {
        this.route.navigate(['/admin/create-wallet']);
      }
  
      restoreWallet() {
        this.route.navigate(['/admin/import-wallet']);
      }   
      
      getCoinName(coinType) {
          return this.utilServ.getCoinNameByTypeId(coinType);
      }

      getCoinAmount(amount) {
          return this.utilServ.toNumber(this.utilServ.showAmount(amount, 18));
      }
  }

