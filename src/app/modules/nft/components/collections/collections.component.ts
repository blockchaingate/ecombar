import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { NftCollectionService } from '../../services/nft-collection.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { ABI, Bytecode } from '../../../../config/erc1155';
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
      let args = ['ERC1155','ERC1155','',environment.addresses.smartContract.ProxyRegistry];
      const resp = await this.kanbanSmartContract.deploySmartContract(seed, ABI, Bytecode, args);

      if(resp && resp.ok && resp._body && resp._body.status == '0x1') {
        const txid = resp._body.transactionHash;
        this.kanbanSmartContract.getTransactionReceipt(txid).subscribe(
          (receipt: any) => {
            if(receipt && receipt.transactionReceipt) {
              if(receipt.transactionReceipt.contractAddress) {
                this.collection.smartContractAddress = receipt.transactionReceipt.contractAddress;
                this.collection.creator = this.address;
                this.collectionServ.create(this.collection).subscribe(
                  (res: any) => {
                    console.log('res from create collection=', res);
                    this.spinner.hide();
                    if(res && res.ok) {
                      this.collection = res._body;
                      this.collections.push(this.collection);
                      this.modalRef = this.modalService.show(templateDone);
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
      } else {
        this.spinner.hide();
        this.toastr.error('Failed to create smart contract.', 'Ok');
      }
    }


    createCollection(event, templateDone) {
        console.log('event in createCollection=', event);
        
 

        const collection = {
          type: 'ERC1155',
          name: event.name,
          description: event.description,
          image: event.image,
          address: this.address,
          payoutPercentageFee: event.payoutPercentageFee,
          payoutWalletAddress: event.payoutWalletAddress
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
