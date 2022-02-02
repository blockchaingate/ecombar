import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/modules/shared/models/cart-item';
import { FavoriteService } from 'src/app/modules/shared/services/favorite.service';
import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { Router } from '@angular/router';

@Component({
  template:''
})
export class WishlistComponent implements OnInit {
  favoriteId: string;
  modalRef: BsModalRef;
  favorites: any;
  store: any;
  storeId: string;
  wallet: any;
  constructor(
    private dataServ: DataService,
    private router: Router,
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

    this.dataServ.currentStore.subscribe(
      (store: any) => {
        if(store) {
          this.store = store;
          const storeId = this.store._id;
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
      giveAwayRate: item.giveAwayRate ? item.giveAwayRate : this.store.giveAwayRate,
      taxRate: item.taxRate ? item.taxRate : this.store.taxRate,
      lockedDays: item.lockedDays ? item.lockedDays : this.store.lockedDays,

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
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
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
