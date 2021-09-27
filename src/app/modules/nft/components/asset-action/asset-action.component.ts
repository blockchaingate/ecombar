import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { NftOrder } from '../../models/nft-order';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { NftOrderService } from '../../services/nft-order.service';
import { NftPortService } from '../../services/nft-port.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';


import { UtilService } from 'src/app/modules/shared/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { NftCancelListingComponent } from '../../modals/cancel-listing/cancel-listing.component';
import { NftPriceChangeComponent } from '../../modals/price-change/price-change.component';
import BigNumber from 'bignumber.js';

@Component({
    providers: [],
    selector: 'app-nft-asset-action',
    templateUrl: './asset-action.component.html',
    styleUrls: ['./asset-action.component.scss']
  })
  export class NftAssetActionComponent implements OnInit {
    @Input() balance: number;
    @Input() asset: any;
    @Input() address: string;
    @Input() owner: string;
    @Input() wallet: any;
    @Input() contractType: string;
    @Input() balances: any;
    
    @Output() onAction = new EventEmitter();
    @Input() sellOrder: NftOrder;
    isOwner: boolean;
    newPriceEntity: any;
    modalRef: BsModalRef;

    constructor(
      private router: Router, 
      private spinner: NgxSpinnerService,
      private coinServ: CoinService,
      private nftPortServ: NftPortService,
      private kanbanServ: KanbanService,
      private nftOrderServ: NftOrderService,
      private utilServ: UtilService,
      private toastr: ToastrService,
         
      private modalServ: BsModalService
      ) {

    }
    ngOnInit() {
      this.isOwner = false;
      if(this.owner && this.address) {
        this.isOwner = this.owner == this.address;
      } else
      if(this.balance) {
        this.isOwner = true;
      }
               
    }

    sell() {
      this.router.navigate(['/nft/assets/' + this.asset.smartContractAddress + '/' + this.asset.tokenId + '/sell']);
    }

    buy() {
      console.log('buy it');
      this.onAction.emit({action:'buy', order: this.sellOrder});
    }

    priceChange() {
      this.modalRef = this.modalServ.show(NftPriceChangeComponent);
      this.modalRef.content.onClose.subscribe( (entity: any) => {
          this.newPriceEntity = entity;
          this.onAction.emit({action:'change', order: this.sellOrder, newPriceEntity: this.newPriceEntity});
      });
    }



    cancelListing() {
      this.onAction.emit({action:'cancel', order: this.sellOrder});
    }

    validate() {
      this.nftPortServ.validateOrder(this.sellOrder).subscribe(
        (res: any) => {
          console.log('res for sellOrder from validateOrder=', res);
        }
      );

    }

    isSellOrderOwner() {
      if(!this.sellOrder) {
        return false;
      }
      const seller = this.utilServ.exgToFabAddress(this.sellOrder.maker) ;
      return seller == this.address;
    }

    getSellOrderTotal() {
      let total = this.sellOrder.basePrice.toString();
      if(this.sellOrder.amount) {
        total = new BigNumber(total).multipliedBy(new BigNumber(this.sellOrder.amount)).toString();
      }
      total = total + ' ' + this.utilServ.getCoinNameByTypeId(this.sellOrder.coinType);
      return total;
    }
    getSeller() {
      const seller = this.utilServ.exgToFabAddress(this.sellOrder.maker) ;
      return seller;
    }

  }
