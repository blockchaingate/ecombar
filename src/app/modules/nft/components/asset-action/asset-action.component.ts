import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { NftOrder } from '../../models/nft-order';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { NftOrderService } from '../../services/nft-order.service';
import { NftPortService } from '../../services/nft-port.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { KanbanSmartContractService } from '../../../shared/services/kanban.smartcontract.service';
import { environment } from '../../../../../environments/environment';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
    providers: [],
    selector: 'app-nft-asset-action',
    templateUrl: './asset-action.component.html',
    styleUrls: ['./asset-action.component.scss']
  })
  export class NftAssetActionComponent implements OnInit {
    @Input() asset: any;
    @Input() address: string;
    @Input() wallet: any;
    @Input() owner: string;
    sellOrder: any;
    isOwner: boolean;
    hasSellOrder: boolean;
    modalRef: BsModalRef;

    constructor(
      private router: Router, 
      private spinner: NgxSpinnerService,
      private coinServ: CoinService,
      private nftPortServ: NftPortService,
      private kanbanServ: KanbanService,
      private utilServ: UtilService,
      private kanbanSmartContract: KanbanSmartContractService,      
      private modalServ: BsModalService
      ) {

    }
    ngOnInit() {
      this.isOwner = false;
      this.hasSellOrder = false;
      if(this.owner && this.address) {
        this.isOwner = this.owner == this.address;
      }
      if(this.asset) {
        if(this.asset.orders && this.asset.orders.length > 0) {
          const sellOrders = this.asset.orders.filter(item => item.side == 1);
          
          if(sellOrders && sellOrders.length > 0) {
            this.sellOrder = sellOrders[sellOrders.length - 1];
            this.hasSellOrder = true;
            console.log('this.sellOrder1111=', this.sellOrder);
          }
          
        }        
      }                
    }

    sell() {
      this.router.navigate(['/nft/assets/' + this.asset.smartContractAddress + '/' + this.asset.tokenId + '/sell']);
    }

    buy() {
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        this.spinner.show();
        this.buyDo(seed);
      });

    }
    
    async buyDo(seed: Buffer) {
      const buyorder: NftOrder = this.nftPortServ.createBuyOrder(
        this.utilServ.fabToExgAddress(this.address), this.sellOrder);

      console.log('buyorder=', buyorder);
      //const hashToSign = this.nftPortServ.hashToSign(buyorder);
      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey;
      const signature = await this.nftPortServ.getOrderSignature(buyorder, privateKey);
      buyorder.r = signature.r;
      buyorder.s = signature.s;
      buyorder.v = signature.v;

      const metadata = null;
      const atomicMathAbiArgs = this.nftPortServ.atomicMatch(this.sellOrder, buyorder, metadata);

      console.log('smart contract address=', environment.addresses.smartContract.NFT_Exchange);
      console.log('atomicMathAbiArgs.args=', atomicMathAbiArgs.args);
      const resp = await this.kanbanSmartContract.execSmartContract(
        seed, environment.addresses.smartContract.NFT_Exchange, atomicMathAbiArgs.abi, atomicMathAbiArgs.args);

      console.log('resp from execSmartContract=', resp);

    }



  }
