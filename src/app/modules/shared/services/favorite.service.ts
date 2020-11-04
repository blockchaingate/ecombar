import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  constructor(private http: HttpService) {
  }

  create(data) {
    return this.http.post('favorite/Create', data);
  }  

  isMyFavorite(productId) {

    const url = 'favorite/isMyFavorite/' + productId;
    console.log('url=', url);
    return this.http.get(url);
  }

  deleteFavorite(id) {
    return this.http.get('favorite/Delete/' + id);
  }  

  getMine() {
    return this.http.get('favorite/mine');
  }
}