import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  token: string;
  path = environment.endpoints.blockchaingate + 'products/';

  constructor(private httpClient: HttpClient) {
  }
  
  create(data) {
    return this.httpClient.post(this.path + 'Create', data);
  }

  getMerchantProducts(token: string) {
    const url = this.path + 'merchant/products?token=' + token;
    console.log('url=', url);
    return this.httpClient.get(url);
  }


  getMerchantAllProducts() {
    const url = this.path + 'merchant/all/products';
    console.log('url=', url);
    return this.httpClient.get(url);
  }  
}