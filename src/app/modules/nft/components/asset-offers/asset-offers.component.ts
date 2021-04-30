import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NftMakeOfferComponent } from '../../modals/make-offer/make-offer.component';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { NftOrder } from '../../models/nft-order';
import { NftPortService } from '../../services/nft-port.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NftOrderService } from '../../services/nft-order.service';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { environment } from '../../../../../environments/environment';

@Component({
    providers: [],
    selector: 'app-nft-asset-offers',
    templateUrl: './asset-offers.component.html',
    styleUrls: ['./asset-offers.component.scss']
  })
  export class NftAssetOffersComponent implements OnInit {
    @Input() offers: any;
    @Input() address: string;
    @Input() owner: string;
    @Input() wallet: any;
    @Input() asset: any;
    @Output() refresh = new EventEmitter();
    isOwner: boolean;
    modalRef: BsModalRef;
    coin: string;
    quantity: number;

    constructor(
      private spinner: NgxSpinnerService, 
      private utilServ: UtilService, 
      private coinServ: CoinService,
      private toastr: ToastrService,
      private translateServ: TranslateService,
      private orderServ: NftOrderService,
      private kanbanSmartContract: KanbanSmartContractService,
      private nftPortServ: NftPortService,
      private modalServ: BsModalService) {}
    ngOnInit() {
      this.isOwner = false;
      if(this.owner && this.address) {
        this.isOwner = this.owner == this.address;
      }    
      
      console.log('thisowner=', this.owner);
      console.log('address=', this.address);
    }


    addressDisplay(address: string) {
      return this.utilServ.addressDisplay(address);
    }

    displayCoinName(coinType: number) {
      return this.utilServ.getCoinNameByTypeId(coinType);
    }

    makeOffer() {
      this.modalRef = this.modalServ.show(NftMakeOfferComponent);

      this.modalRef.content.onClose.subscribe( (data: any) => {
        console.log('data=', data);
        this.coin = data.coin;
        this.quantity = data.quantity;
        const initialState = {
          pwdHash: this.wallet.pwdHash,
          encryptedSeed: this.wallet.encryptedSeed
        };          
        
        this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
  
        this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
          this.spinner.show();
          this.makeOfferDo(seed);
        });       
      });

    }

    async makeOfferDo(seed: Buffer) {
      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey;      
      const makerRelayerFee = 250;
      const coinType = this.coinServ.getCoinTypeIdByName(this.coin);
      const price = this.quantity;
      const addressHex = this.utilServ.fabToExgAddress(this.address);

      const order: NftOrder = this.nftPortServ.createOrder(
        addressHex,
        this.utilServ.fabToExgAddress(this.owner), 
        this.asset.smartContractAddress, 
        this.asset.tokenId,
        coinType, 
        price,
        makerRelayerFee,
        0);

      const {signature, hash, hashForSignature} = await this.nftPortServ.getOrderSignature(order, privateKey);
      order.hash = hash;
      order.hashForSignature = hashForSignature;
      order.r = signature.r;
      order.s = signature.s;
      order.v = signature.v;

      this.orderServ.create(order).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.spinner.hide();
            this.toastr.success(this.translateServ.instant('Make offer successfully'));
            
          }
        }
      );
    }


    acceptOffer(offer) {
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        this.spinner.show();
        this.acceptOfferDo(seed, offer);
      });     
    }

    async acceptOfferDo(seed: Buffer, offer) {
      const buyorder = NftOrder.from(offer);
      const sellorder: NftOrder = this.nftPortServ.createSellOrder(
        this.utilServ.fabToExgAddress(this.address), buyorder);

      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey;
      const {signature, hash, hashForSignature} = await this.nftPortServ.getOrderSignature(sellorder, privateKey);
      sellorder.hash = hash;
      sellorder.hashForSignature = hashForSignature;
      sellorder.r = signature.r;
      sellorder.s = signature.s;
      sellorder.v = signature.v;

      sellorder.salt = this.utilServ.getRandomInteger();

      const metadata = null;
      const atomicMathAbiArgs = this.nftPortServ.atomicMatch(sellorder, buyorder, metadata);

      console.log('sellorder==', sellorder.toString());
      console.log('buyorder==', buyorder.toString());
      this.nftPortServ.ordersCanMatch(buyorder, sellorder).subscribe(
        (ret: any) => {
          console.log('ret for can match=', ret);
        }
      );
      const txhex = await this.kanbanSmartContract.getExecSmartContractHex(
        seed, environment.addresses.smartContract.NFT_Exchange, 
        atomicMathAbiArgs.abi, atomicMathAbiArgs.args);
      
      this.orderServ.atomicMatch(buyorder.id, sellorder, txhex).subscribe(
        (res: any) => {
          console.log('res from atomicMatch=', res);
          this.spinner.hide();
          this.refresh.emit();
          if(res && res.ok) {
            this.toastr.info('Post the transaction successfully');
          }else {
            this.toastr.error('Error while posting the transaction');
          }
        }
      );        
    }
  }
