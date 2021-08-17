import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NftFavoriteService } from '../../services/nft-favorite.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { KanbanService } from 'src/app/modules/shared//services/kanban.service';
import { UtilService } from 'src/app/modules/shared//services/util.service';

@Component({
    providers: [],
    selector: 'app-nft-account-in-wallet-asset',
    templateUrl: './account-in-wallet-asset.component.html',
    styleUrls: ['./account-in-wallet-asset.component.scss']
  })
  export class NftAccountInWalletAssetComponent implements OnInit {
    @Input() asset: any;
    @Input() isFavorite: boolean;
    @Input() favoriteCount: number;
    @Input() wallet: any;
    modalRef: BsModalRef;

    constructor(
      private favoriteServ: NftFavoriteService,
      private kanbanServ: KanbanService,
      private utilServ: UtilService,
      private modalServ: BsModalService
      ) {}
    ngOnInit() {
          
    }

    addFavorite() {
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onCloseFabPrivateKey.subscribe( (privateKey: any) => {
        this.addFavoriteDo(privateKey);
      }); 
    }

    removeFavorite() {
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onCloseFabPrivateKey.subscribe( (privateKey: any) => {
        this.removeFavoriteDo(privateKey);
      }); 
    }

    addFavoriteDo(privateKey: any) {

      const body = {
        smartContractAddress: this.asset.smartContractAddress,
        tokenId: this.asset.tokenId
      };
      const sig = this.kanbanServ.signJsonData(privateKey, body);
      body['sig'] = sig.signature;   

      this.favoriteServ.add(body).subscribe(
        (ret: any) => {
          if(ret && ret.ok) {
            this.isFavorite = true;
            this.favoriteCount ++;
          }
        }
      );
    }  

    getCoinName(coinType) {
      return this.utilServ.getCoinNameByTypeId(coinType);
    }
    
    removeFavoriteDo(privateKey: any) {
      const body = {
        smartContractAddress: this.asset.smartContractAddress,
        tokenId: this.asset.tokenId
      };
      const sig = this.kanbanServ.signJsonData(privateKey, body);
      body['sig'] = sig.signature;   
            
      this.favoriteServ.remove(body).subscribe(
        (ret: any) => {
          if(ret && ret.ok) {
            this.isFavorite = false;
            this.favoriteCount --;
          }
        }
      );
    }
  }
