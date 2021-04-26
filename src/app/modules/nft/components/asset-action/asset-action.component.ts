import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { NftOrder } from '../../models/nft-order';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NftOrderService } from '../../services/nft-order.service';
import { NftPortService } from '../../services/nft-port.service';

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
      private utilServ: UtilService,
      private nftPortServ: NftPortService,
      private orderServ: NftOrderService,      
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
    
    buyDo(seed: Buffer) {
      const buyorder: NftOrder = this.nftPortServ.createBuyOrder(this.address, this.sellOrder);
      const hashToSign = this.nftPortServ.hashToSign(buyorder);
      const metadata = '0x0';
      this.nftPortServ.atomicMatch(this.sellOrder, buyorder, metadata);
    }



  }
