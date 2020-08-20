import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) {
  }

  qrcodepay(data) {
    const url = environment.endpoints.blockchaingate + 'payment/gateway';
    return this.httpClient.post(url, data);
  }

  checkPaymentStatus(code: string) {
    const url = environment.endpoints.blockchaingate + 'payment/gateway/' + code;
    return this.httpClient.get(url);
  }
}