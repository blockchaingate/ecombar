import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../shared/models/cart-item';
import { FavoriteService } from '../../shared/services/favorite.service';
import { CartStoreService } from '../../shared/services/cart.store.service';
import { DataService } from '../../shared/services/data.service';
import { PasswordModalComponent } from '../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from '../../shared/services/kanban.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  favoriteId: string;
  modalRef: BsModalRef;
  favorites: any;
  storeId: string;
  wallet: any;
  constructor(
    private dataServ: DataService,
    private kanbanServ: KanbanService,
    private modalService: BsModalService,
    private cartStoreServ: CartStoreService, 
    private favoriteServ: FavoriteService) { }

  ngOnInit() {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );

    this.dataServ.currentStoreId.subscribe(
      (storeId: string) => {
        if(storeId) {
          this.storeId = storeId;
          this.dataServ.currentWalletAddress.subscribe(
            (walletAddress: string) => {
              this.favoriteServ.getMine(storeId, walletAddress).subscribe(
                (res: any) => {
                  if(res && res.ok) {
                    this.favorites = res._body;
                    console.log('this.favorites==', this.favorites);
                  }
                }
              );
            }
          );
        }
      }
    );

  }

  addToCart(item) {
    const cartItem: CartItem = {
      productId: item._id,
      objectId: item.objectId,
      title: item.title,
      price: item.price,
      storeId: this.storeId,
      thumbnailUrl: item.images ? item.images[0] : null,
      quantity: 1
    };
    this.cartStoreServ.addCartItem(cartItem);    
  }

  unfavorite(id:string) {
    this.favoriteId = id;

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
