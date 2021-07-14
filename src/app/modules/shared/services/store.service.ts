import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Store } from '../../../models/store';

@Injectable({ providedIn: 'root' })
export class StoreService {
  constructor(private http: HttpService) { }

  getStoresByAddress(address: string) {
    return this.http.get('stores/ownedBy/' + address);
  }

  deleteStore(id: string) {
    return this.http.delete('stores/' + id);
  }

  getStores() {
    return this.http.get('stores');
  }

  getStore(id: string) {
    return this.http.get('stores/' + id);
  }

  create(data:any) {
    return this.http.post('stores/Create', data);
  }

  update(id: string, data: any) {
    return this.http.put('stores/' + id, data);
  }
}