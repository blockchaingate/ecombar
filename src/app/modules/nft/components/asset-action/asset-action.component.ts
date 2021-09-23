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
import { KanbanSmartContractService } from '../../../shared/services/kanban.smartcontract.service';
import { environment } from '../../../../../environments/environment';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { NftCancelListingComponent } from '../../modals/cancel-listing/cancel-listing.component';
import { NftPriceChangeComponent } from '../../modals/price-change/price-change.component';

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
    
    
    @Output() refresh = new EventEmitter();
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
      private kanbanSmartContract: KanbanSmartContractService,      
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

    priceChange() {
      this.modalRef = this.modalServ.show(NftPriceChangeComponent);
      this.modalRef.content.onClose.subscribe( (entity: any) => {
          this.newPriceEntity = entity;
          const initialState = {
            pwdHash: this.wallet.pwdHash,
            encryptedSeed: this.wallet.encryptedSeed
          };          
          
          this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
    
          this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
            this.spinner.show();
            this.priceChangeDo(seed);
          });  
      });
    }

    async priceChangeDo(seed: Buffer) {
      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey;      
      const makerRelayerFee = 250;
      const coinType = this.coinServ.getCoinTypeIdByName(this.newPriceEntity.coin);
      const price = this.newPriceEntity.quantity;
      const addressHex = this.utilServ.fabToExgAddress(this.address);

      const order: NftOrder = this.nftPortServ.createOrder(
        addressHex, 
        null,
        this.asset.smartContractAddress, 
        this.asset.tokenId,
        coinType, 
        price,
        makerRelayerFee,
        1);



      const {signature, hash, hashForSignature} = await this.nftPortServ.getOrderSignature(order, privateKey);
      order.hash = hash;
      order.hashForSignature = hashForSignature;
      order.r = signature.r;
      order.s = signature.s;
      order.v = signature.v;


      this.nftOrderServ.changePrice(this.sellOrder.id, order).subscribe(
        (res: any) => {
          this.spinner.hide();
          if(res && res.ok) {
            this.toastr.info('Price was changed successfully');
          } else {
            this.toastr.error('Failed to change price');
          }
        }
      );      
    }

    cancelListing() {
      this.modalRef = this.modalServ.show(NftCancelListingComponent);
      this.modalRef.content.onClose.subscribe( (op: String) => {
        if(op == 'confirm') {
          const initialState = {
            pwdHash: this.wallet.pwdHash,
            encryptedSeed: this.wallet.encryptedSeed
          };          
          
          this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
    
          this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
            this.cancelListingDo(seed);
          });          
        }
      });
    }

    cancelListingDo(seed: Buffer) {
      this.nftOrderServ.cancel(this.sellOrder.id).subscribe(
        (res: any) => {
          if(res && res.ok) {
            const body = res._body;
            this.toastr.info('Your listing was canceled successfully');
          } else {
            this.toastr.error('Failed to cancel your listing');
          }
        }
      );
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

    validate() {
      this.nftPortServ.validateOrder(this.sellOrder).subscribe(
        (res: any) => {
          console.log('res for sellOrder from validateOrder=', res);
        }
      );

    }

    async buyDo(seed: Buffer) {
      let buyorder: NftOrder;
      console.log('go for buye');
      if(this.contractType == 'ERC1155') {
        buyorder = this.nftPortServ.createBuyOrderERC1155(
          this.utilServ.fabToExgAddress(this.address), this.sellOrder);
      } else {
        buyorder = this.nftPortServ.createBuyOrder(
          this.utilServ.fabToExgAddress(this.address), this.sellOrder);
      }

      console.log('hehre');
      console.log('buyorder=', buyorder);
      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey;
      const {signature, hash, hashForSignature} = await this.nftPortServ.getOrderSignature(buyorder, privateKey);
      buyorder.hash = hash;
      buyorder.hashForSignature = hashForSignature;
      buyorder.r = signature.r;
      buyorder.s = signature.s;
      buyorder.v = signature.v;

      buyorder.salt = this.utilServ.getRandomInteger();

      const metadata = null;
      
      console.log('this.sellOrder=', this.sellOrder.toString());
      console.log('buyorder=', buyorder.toString());
      
      const atomicMathAbiArgs = this.nftPortServ.atomicMatch(this.sellOrder, buyorder, metadata);
      /*
      this.nftPortServ.ordersCanMatch(buyorder, this.sellOrder).subscribe(
        (ret:any) => {
          console.log('ret for can match=', ret);
        }
      );
      */
      const txhex = await this.kanbanSmartContract.getExecSmartContractHex(
        seed, environment.addresses.smartContract.NFT_Exchange, 
        atomicMathAbiArgs.abi, atomicMathAbiArgs.args);
      
      
      this.nftOrderServ.atomicMatch(this.owner, this.sellOrder.id, buyorder, txhex).subscribe(
        (res: any) => {
          console.log('res from atomicMatch=', res);
          this.spinner.hide();
          this.refresh.emit();
          if(res && res.ok) {
            this.owner = this.address;
            this.isOwner = true;
            this.sellOrder = null;
            this.toastr.info('Post the transaction successfully');
          }else {
            this.toastr.error('Error while posting the transaction');
          }
        }
      );  

    }



  }
