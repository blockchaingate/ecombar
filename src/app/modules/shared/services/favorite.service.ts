import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  constructor(private http: HttpService) {
  }

  create(data) {
    return this.http.post('favorite/Create', data, false);
  }  

  isMyFavorite(productId) {

    const url = 'favorite/isMyFavorite/' + productId;
    console.log('url=', url);
    return this.http.get(url, false);
  }

  deleteFavorite(data) {
    return this.http.post('favorite/Delete', data, false);
  }  

  getMine(storeId: string, owner: string) {
    return this.http.get('favorite/mine/' + storeId + '/' + owner, false);
  }
}