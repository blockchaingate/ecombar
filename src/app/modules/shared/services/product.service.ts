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

  getMerchantProducts() {

    return this.apiServ.getPrivate('merchant/products');
  }


  getMerchantAllProducts() {
    return this.apiServ.getPublic('merchant/all/products');
  }  
}