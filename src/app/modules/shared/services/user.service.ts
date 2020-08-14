import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  token: string;
  path = environment.endpoints.blockchaingate + 'members/';

  constructor(private httpClient: HttpClient) {
  }

  signin(email: string, password: string) {
    const theBody = { email: email, password: password, appId: environment.appid };
    
    return this.httpClient.post(this.path + 'login', theBody);
  }  

  saveToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    if(!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }
}