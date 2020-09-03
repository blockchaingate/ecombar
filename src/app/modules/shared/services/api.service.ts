import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token: string;
  constructor(private httpClient: HttpClient, private userServ: UserService) {
  }

  formHttpOption() {
    if(!this.token) {
      this.token = this.userServ.getToken();
    }
		const httpOptions = {
		  headers: new HttpHeaders({
		    'Content-Type':  'application/json',
		    'x-access-token': this.token
		  })
    };	
    return httpOptions;
  }

  qrcodepay(data) {
    const url = environment.endpoints.blockchaingate + 'payment/gateway';
    return this.httpClient.post(url, data);
  }

  checkPaymentStatus(code: string) {
    const url = environment.endpoints.blockchaingate + 'payment/gateway/' + code;
    return this.httpClient.get(url);
  }

  postPrivate(endpoint, data) {

    const httpOptions = this.formHttpOption();
    if (!httpOptions) {
      const ret = {
        success: false,
        message: 'token is null'
      }
      return of(ret);
    }
    return this.httpClient
    .post(environment.endpoints.blockchaingate + endpoint, data, httpOptions);
  }

  getPrivate(endpoint) {

    const httpOptions = this.formHttpOption();
    if (!httpOptions) {
      const ret = {
        success: false,
        message: 'token is null'
      }
      return of(ret);
    }
    return this.httpClient
    .get(environment.endpoints.blockchaingate + endpoint, httpOptions);
  }

  getPublic(endpoint) {
    const url = environment.endpoints.blockchaingate + endpoint;
    return this.httpClient.get(url);
  }

  postPublic(endpoint, data) {
    return this.httpClient
    .post(environment.endpoints.blockchaingate + endpoint, data);    
  }
}