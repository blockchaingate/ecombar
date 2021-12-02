import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class StoreService {
  constructor(private http: HttpService) { }

  getAll() {
    return this.http.get('stores');
  }

  getStoresByAddress(address: string) {
    return this.http.get('stores/ownedBy/' + address);
  }

  deleteStore(data: any) {
    return this.http.post('stores/Delete', data, false);
  }

  getStores() {
    return this.http.get('stores/all/approved');
  }

  getStore(id: string) {
    const url = 'stores/' + id;
    console.log('urllll for getStore=', url);
    return this.http.get(url);
  }

  create(data:any) {
    return this.http.post('stores/Create', data, false);
  }

  update(id: string, data: any) {
    return this.http.post('stores/Update/' + id, data, false);
  }
}