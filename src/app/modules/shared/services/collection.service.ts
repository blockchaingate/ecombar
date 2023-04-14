import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const baseUrl = environment.endpoints['paycool'];

@Injectable({ providedIn: 'root' })
export class CollectionService {
  constructor(private http: HttpClient) {
  }

  create(data) {
    return this.http.post('product-collections/Create', data);
  }

  update(id: string, data) {
    return this.http.post('product-collections/Update/' + id, data);
  }

  getCollections() {
    return this.http.get('product-collections/');
  }

  getCollectionsForStore(storeId: string) {
    return this.http.get('product-collections/merchant/' + storeId);
  }

  getAdminCollections() {
    return this.http.get('product-collections/admin');
  }

  getMerchantCollections(walletAddress: string, pageSize: number, pageNum: number) {
    return this.http.get(baseUrl + 'collection/owner/' + walletAddress + '/' + pageSize + '/' + pageNum);
  }

  getCollection(id: string) {
    return this.http.get('product-collections/' + id);
  }

  deleteCollection(data: any) {
    return this.http.post('product-collections/Delete', data);
  }
}