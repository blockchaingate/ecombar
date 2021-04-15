import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { NftCollectionService } from '../../services/nft-collection.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { ABI, Bytecode } from '../../../../config/erc721';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import Common from 'ethereumjs-common';
import KanbanTxService from '../../../shared/services/kanban.tx.service';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";

@Component({
    providers: [],
    selector: 'app-nft-collections',
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.scss']
  })
  export class NftCollectionsComponent implements OnInit {
    modalRef: BsModalRef;
    address: string;
    wallet: any;
    collection: any;
    collections: any;
    constructor(
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
      private localSt: LocalStorage,
      private collectionServ: NftCollectionService,
      private router: Router,
      private coinServ: CoinService,
      private kanbanServ: KanbanService,
      private utilServ: UtilService,
      private web3Serv: Web3Service,
      private modalService: BsModalService) {}
 
   
    ngOnInit() {
        this.address = '';
        this.collections = [];

        this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

          if(!wallets || (wallets.length == 0)) {
            return;
          }
          const wallet = wallets.items[wallets.currentIndex];
          this.wallet = wallet;
          const addresses = wallet.addresses;
          this.address = addresses.filter(item => item.name == 'FAB')[0].address;
          console.log('this.address=', this.address);
          this.collectionServ.getByAddress(this.address).subscribe(
            (res:any) => {
              if(res && res.ok) {
                this.collections = res.data;
              }
            }
          );
        });        
    }

    formCreateKanbanSmartContractABI() {
      const abi = ABI;
      let args = ['NFT','NFT','0xe4a44dbe32be2cadfde734bb2084b5f6c3672e44'];

      return this.web3Serv.formCreateSmartContractABI(abi, Bytecode, args);
   
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    } 

    async deployKanbanDo(seed, templateDone) {
      const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      // const nonce = await this.apiServ.getEthNonce(this.ethCoin.receiveAdds[0].address);
      let gasPrice = 2;
      let gasLimit = 8000000;
      const nonce = await this.kanbanServ.getTransactionCount(this.utilServ.fabToExgAddress(this.address));
  
      let kanbanValue = 0;
  
      const kanbanData = this.formCreateKanbanSmartContractABI();
      const txObject = {
          nonce: nonce,
          gasPrice: gasPrice,
          gasLimit: gasLimit,
          value: kanbanValue,
          data: '0x' + this.utilServ.stripHexPrefix(kanbanData)          
      };
  
      let privKey: any = keyPairsKanban.privateKeyBuffer;
  
      if(!Buffer.isBuffer(privKey)) {
        privKey = privKey.privateKey;
      }
      
      let txhex = '';
  
  
      const customCommon = Common.forCustomChain(
        environment.chains.ETH.chain,
        {
          name: environment.chains.KANBAN.chain.name,
          networkId: environment.chains.KANBAN.chain.networkId,
          chainId: environment.chains.KANBAN.chain.chainId
        },
        environment.chains.ETH.hardfork,
      );
      const tx = new KanbanTxService(txObject, { common: customCommon });
  
      tx.sign(privKey);
      const serializedTx = tx.serialize();
      txhex = '0x' + serializedTx.toString('hex');
  
      this.kanbanServ.sendRawSignedTransaction(txhex).subscribe(
        (resp: any) => {
        if (resp && resp.transactionHash) {
          const txid = resp.transactionHash;
          console.log('txid=', resp.transactionHash);
          var that = this;
          var myInterval = setInterval(function(){ 
            that.kanbanServ.getTransactionReceipt(txid).subscribe(
              (receipt: any) => {
                if(receipt && receipt.transactionReceipt) {
                  clearInterval(myInterval);
                  if(receipt.transactionReceipt.contractAddress) {
                    that.collection.smartContractAddress = receipt.transactionReceipt.contractAddress;
                    that.collectionServ.create(that.collection).subscribe(
                      (res: any) => {
                        console.log('res from create collection=', res);
                        that.spinner.hide();
                        if(res && res.ok) {
                          that.collection = res.data;
                          that.collections.push(that.collection);
                          that.modalRef = that.modalService.show(templateDone);
                        }
                      }
                    );
                  } else {
                    this.spinner.hide();
                    this.toastr.error('Error with creating smart contract.', 'Ok');
                  }
                }
              }
            );
           }, 1000);

          //this.result = 'txid:' + resp.transactionHash;
          //this.alertServ.openSnackBarSuccess('Smart contract was created successfully.', 'Ok');
        } else {
          this.toastr.error('Failed to create smart contract.', 'Ok');
          //this.alertServ.openSnackBar('Failed to create smart contract.', 'Ok');
        }
      },
      error => {
        //this.alertServ.openSnackBar(error.error, 'Ok');
      }
      );

    }


    createCollection(event, templateDone) {
        console.log('event in createCollection=', event);
        
 

        const collection = {
          name: event.name,
          description: event.description,
          image: event.image,
          address: this.address
        }

        this.collection = collection;

        this.modalRef.hide();

        const initialState = {
          pwdHash: this.wallet.pwdHash,
          encryptedSeed: this.wallet.encryptedSeed
        };          
        
        this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

        this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
          this.spinner.show();
          this.collectionServ.checkNameExist(event.name).subscribe(
            async (res: any) => {
              if(res && res.ok) {


                                
                const existed = res.data;
                if(existed) {
                  this.spinner.hide();
                  this.toastr.info('name existed', 'Ok');
                  return;
                }
                await this.deployKanbanDo(seed, templateDone);
              }
            }
          );
          
        });
        
        /*

        */
    }

    createItem(event) {
      this.modalRef.hide();
      this.router.navigate(['/nft/admin/collections/' + this.collection.slug + '/assets/create']);
    }
  }
