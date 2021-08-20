import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { NftCollectionService } from '../../services/nft-collection.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { ABI, Bytecode } from '../../../../config/erc721';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { environment } from 'src/environments/environment';

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
      private kanbanSmartContract: KanbanSmartContractService,
      private modalService: BsModalService) {}
 
   
    ngOnInit() {
        this.address = '';
        this.collections = [];

        this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

          if(!wallets || !wallets.items || (wallets.items.length == 0)) {
            return;
          }
          const wallet = wallets.items[wallets.currentIndex];
          this.wallet = wallet;
          const addresses = wallet.addresses;
          this.address = addresses.filter(item => item.name == 'FAB')[0].address;
          this.collectionServ.getByAddress(this.address).subscribe(
            (res:any) => {
              if(res && res.ok) {
                this.collections = res._body;
              }
            }
          );
        });        
    }


    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    } 

    async deployKanbanDo(seed, templateDone) {
      this.spinner.show();
      let args = ['NFT','NFT',environment.addresses.smartContract.ProxyRegistry];
      const resp = await this.kanbanSmartContract.deploySmartContract(seed, ABI, Bytecode, args);

      if (resp && resp.transactionHash) {
          const txid = resp.transactionHash;
          console.log('txid=', resp.transactionHash);
          var that = this;
          var myInterval = setInterval(function(){ 
            that.kanbanSmartContract.getTransactionReceipt(txid).subscribe(
              (receipt: any) => {
                if(receipt && receipt.transactionReceipt) {
                  clearInterval(myInterval);
                  if(receipt.transactionReceipt.contractAddress) {
                    that.collection.smartContractAddress = receipt.transactionReceipt.contractAddress;
                    that.collection.creator = that.address;
                    that.collectionServ.create(that.collection).subscribe(
                      (res: any) => {
                        console.log('res from create collection=', res);
                        that.spinner.hide();
                        if(res && res.ok) {
                          that.collection = res._body;
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
      } else {
        this.spinner.hide();
        this.toastr.error('Failed to create smart contract.', 'Ok');
      }
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


                                
                const existed = res._body;
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
