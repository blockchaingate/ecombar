import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NftAssetService } from '../../services/nft-asset.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
    providers: [],
    selector: 'app-nft-transfer',
    templateUrl: './transfer.component.html',
    styleUrls: ['./transfer.component.scss']
  })
  export class NftTransferComponent implements OnInit {

      smartContractAddress: string;
      tokenId: string;  
      to: string;
      asset: any;
      wallet: any;
      modalRef: BsModalRef;

      constructor(
        private spinner: NgxSpinnerService,
        private localSt: LocalStorage, 
        private kanbanSmartContractServ: KanbanSmartContractService,
        private assetServ: NftAssetService, 
        private utilServ: UtilService,
        private router: Router,
        private modalServ: BsModalService,
        private route: ActivatedRoute) {}
      ngOnInit() {

        this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

            if(!wallets || !wallets.items || (wallets.items.length == 0)) {
              return;
            }
            const wallet = wallets.items[wallets.currentIndex];
            this.wallet = wallet;
        });        
        this.route.paramMap.subscribe((params: ParamMap) =>  {
            const smartContractAddress = params.get('smartContractAddress');   
            const tokenId = params.get('tokenId'); 
            this.smartContractAddress = smartContractAddress;
            this.tokenId = tokenId;
    
            this.loadAsset();
        });          
      }

      loadAsset() {
        this.assetServ.getBySmartContractTokenId(this.smartContractAddress, this.tokenId).subscribe(
            (res: any) => {
              if(res && res.ok) {
                this.asset = res._body;
              }
        });          
      }

      transfer() {
        const initialState = {
            pwdHash: this.wallet.pwdHash,
            encryptedSeed: this.wallet.encryptedSeed
          };          
          
          this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
    
          this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
            this.spinner.show();
            this.transferDo(seed);
          });
      }

      async transferDo(seed: Buffer) {
          const abi = {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          };
          const args = [this.utilServ.fabToExgAddress(this.to)];
          const txhex = await this.kanbanSmartContractServ.getExecSmartContractHex(
            seed, this.smartContractAddress, abi, args);
          /*
          this.assetServ.transfer(this.smartContractAddress, this.tokenId, this.to, txhex).subscribe(
                (res: any) => {
                  if(res && res.ok) {
                    this.spinner.hide();
                    
                    this.router.navigate(
                      ['/nft/assets/' + this.smartContractAddress + '/' + this.tokenId]
                    );
                    
                  }
                }
              );  
          */        
      }

  }
