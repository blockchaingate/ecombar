import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  constructor(private apiServ: ApiService) {
  }
  
  create(data) {    
    return this.apiServ.postPrivate('product-collections/Create', data);
  }

  update(id:string, data) {
    return this.apiServ.postPrivate('product-collections/Update/' + id, data);
  }

  getCollections() {
    return this.apiServ.getPublic('product-collections');
  }

  getAdminCollections() {
    return this.apiServ.getPublic('product-collections/admin');
  }

  getMerchantCollections(merchantId: string) {
    return this.apiServ.getPublic('product-collections/merchant/' + merchantId);
  }

  getCollection(id: string) {
    return this.apiServ.getPublic('product-collections/' + id);
  }

  deleteCollection(id) {
    return this.apiServ.getPrivate('product-collections/Delete/' + id);
  }    
}