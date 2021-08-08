import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from '../../../shared/services/kanban.service';

@Component({
  selector: 'app-admin-favorite',
  providers: [],
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit{
    favorites: any;
    modalRef: BsModalRef;
    favoriteId: string;
    wallet: any;
    
    constructor(
      private kanbanServ: KanbanService,
      private modalService: BsModalService,
      private dataServ: DataService,
      private favoriteServ: FavoriteService,
      private router: Router) {
    }

    ngOnInit() {
      this.dataServ.currentWallet.subscribe(
        (wallet: any) => {
          this.wallet = wallet;
        }
      );
      this.getFavoriteProducts();
    }

    getFavoriteProducts() {
      this.dataServ.currentWalletAddress.subscribe(
        (walletAddress: string) => {
          if(walletAddress) {
            this.favoriteServ.getMinForAllStores(walletAddress).subscribe(
              (res: any) => {
                console.log('retdfff====', res);
                if(res && res.ok) {
                  this.favorites = res._body;
                }
              }
            );
          }
        }
      );

    }
 
    removeFavorite(favorite) {
      this.favoriteId = favorite._id;
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
  
      this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
        this.unfavoriteDo(privateKey);
      });
    }
    unfavoriteDo(privateKey: any) {

      const data = {
        id: this.favoriteId
      };
      const sig = this.kanbanServ.signJsonData(privateKey, data);
      data['sig'] = sig.signature;   
  
      this.favoriteServ.deleteFavorite(data).subscribe(
        (res: any) => {
          if(res&&res.ok) {
            this.favorites = this.favorites.filter(item => item._id != this.favoriteId);
          }
        }
      );

    }
}