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
    return this.http.get('product-collections', false);
  }

  getAdminCollections() {
    return this.http.get('product-collections/admin');
  }

  getMerchantCollections(merchantId: string) {
    return this.http.get('product-collections/merchant/' + merchantId);
  }

  getCollection(id: string) {
    return this.http.get('product-collections/' + id);
  }

  deleteCollection(id) {
    return this.http.get('product-collections/Delete/' + id);
  }
}