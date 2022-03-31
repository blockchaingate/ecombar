import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NftMakeOfferComponent } from '../../modals/make-offer/make-offer.component';

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
    @Input() collection: any;
    @Input() asset: any;
    @Output() onAction = new EventEmitter();
    modalRef: BsModalRef;
    coin: string;
    quantity: number;

    constructor(
      private utilServ: UtilService, 
      private modalServ: BsModalService) {}
    ngOnInit() {
    }

    isOwner(offer) {
      if(!offer) {
        return false;
      }
      return this.utilServ.exgToFabAddress(offer.maker) == this.address;
    }

    addressDisplay(address: string) {
      return this.utilServ.addressDisplay(address);
    }

    displayCoinName(coinType: number) {
      return this.utilServ.getCoinNameByTypeId(coinType);
    }

    makeOffer() {
      const initialState = {
        collectionType: this.collection.type
      }; 
      this.modalRef = this.modalServ.show(NftMakeOfferComponent, {initialState});

      this.modalRef.content.onClose.subscribe( (data: any) => {
        console.log('data=', data);
        this.coin = data.coin;
        this.quantity = data.quantity;
        this.onAction.emit({action:'makeOffer', order: null, newPriceEntity: data});
        /*
        const initialState = {
          pwdHash: this.wallet.pwdHash,
          encryptedSeed: this.wallet.encryptedSeed
        };          
        
        this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });
  
        this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
          this.spinner.show();
          this.makeOfferDo(seed);
        });  
        */     
      });

    }


    cancel(offer) {
      this.onAction.emit({action:'cancel', order: offer});
    }

    acceptOffer(offer) {
      this.onAction.emit({action:'acceptOffer', order: offer});
      /*
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
        this.spinner.show();
        this.acceptOfferDo(seed, offer);
      });    
      */ 
    }


  }
