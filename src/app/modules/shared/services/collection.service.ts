import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  constructor(private http: HttpService) {
  }

  create(data) {
    return this.http.post('product-collections/Create', data);
  }

  update(id: string, data) {
    return this.http.post('product-collections/Update/' + id, data);
  }

  getCollections() {
    return this.http.get('product-collections/', false);
  }

  getCollectionsForStore(storeId: string) {
    return this.http.get('product-collections/merchant/' + storeId, false);
  }

  getAdminCollections() {
    return this.http.get('product-collections/admin');
  }

  getMerchantCollections(walletAddress: string) {
    return this.http.get('product-collections/merchant/' + walletAddress);
  }

  getCollection(id: string) {
    return this.http.get('product-collections/' + id);
  }

  deleteCollection(data: any) {
    return this.http.post('product-collections/Delete', data);
  }
}