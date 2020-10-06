import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  token: string;
  path = environment.endpoints.blockchaingate + 'products/';

  constructor(private apiServ: ApiService) {
  }
  
  create(data) {
    return this.apiServ.postPrivate('products/Create', data);
  }

  update(id, data) {
    return this.apiServ.putPrivate('products/Update/' + id, data);
  }  
  
  getProduct(id: string) {
    return this.apiServ.getPublic('products/' + id);
  }

  getProducts() {
    return this.apiServ.getPublic('products');
  }

  getMerchantProducts(merchantId: string) {
    console.log('merchantId in here', merchantId);
    return this.apiServ.getPublic('products/merchant/' + merchantId);
  }

  deleteProduct(id) {
    return this.apiServ.getPrivate('products/Delete/' + id);
  }
  getMerchantAllProducts() {
    return this.apiServ.getPublic('products/merchant/all/products');
  }  
}