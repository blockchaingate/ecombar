import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  constructor(private http: HttpService) {
  }

  create(data) {
    return this.http.post('favorite/Create', data, false);
  }  

  isMyFavorite(productId: string, walletAddress: string) {

    const url = 'favorite/isMyFavorite/' + productId + '/' + walletAddress;
    console.log('url in isMyFavorite=', url);
    return this.http.get(url, false);
  }

  deleteFavorite(data) {
    return this.http.post('favorite/Delete', data, false);
  }  

  getMine(storeId: string, owner: string) {
    return this.http.get('favorite/mine/' + storeId + '/' + owner, false);
  }

  getMinForAllStores(owner: string) {
    return this.http.get('favorite/mine/all/' + owner, false);
  }
}