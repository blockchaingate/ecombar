import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  token: string;
  path = environment.endpoints.blockchaingate + 'orders/';

  constructor(private httpClient: HttpClient) {
  }
  
  create(data) {
    return this.httpClient.post(this.path + 'Create', data);
  }
}
