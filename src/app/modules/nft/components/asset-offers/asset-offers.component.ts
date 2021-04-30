import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NftMakeOfferComponent } from '../../modals/make-offer/make-offer.component';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";

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
    isOwner: boolean;
    modalRef: BsModalRef;
    constructor(
      private spinner: NgxSpinnerService, 
      private utilServ: UtilService, 
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

    makeOfferDo(seed: Buffer) {

    }
  }
