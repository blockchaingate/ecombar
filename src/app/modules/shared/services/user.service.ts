import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  token: string;
  aud: string;
  merchantId: string;

  constructor(
    private apiServ: ApiService, 
    private authServ: AuthService,
    private storageServ: StorageService) {
  }

  signin(email: string, password: string) {
    const theBody = { email: email, password: password, appId: environment.appid };
    
    return this.apiServ.postPublic('members/login', theBody);
  }  

  signup(email: string, password: string) {
    const theBody = { email: email, password: password, appId: environment.appid };
    
    return this.apiServ.postPublic('members/create', theBody);
  }  
  getMe() {
    return this.apiServ.getPrivate('members/me');
  }
  activateUser(userId: string, activationCode: string, appId: string) {
    return this.apiServ.getPublic('members/' + 'activation/' + userId + '/' + activationCode + '/' + appId);
  }

  // userId + "/" + activationCode + "/" + app._id
  saveToken(token: string) {
    console.log('token for save=', token);
    this.token = token;
    if(token) {
      const decoded = this.authServ.decodeToken(token);
      this.aud = decoded.aud;
      console.log('this.aud in saveToken=', this.aud);
      this.merchantId = decoded.merchantId;
      return this.storageServ.saveToken(token);
    }
    return this.storageServ.removeToken();
    
  }

  /*
  getAud() {
    if(!this.aud) {
      const token = this.getToken();
      console.log('token in getAud=', token);
      const decoded = this.decodeToken(token);
      console.log('decoded==', decoded);
      this.aud = decoded.aud;
      this.merchantId = decoded.merchantId;
    }
    return this.aud;
  }

  getMerchantId() {
    if(!this.merchantId) {
      const token = this.getToken();
      const decoded = this.decodeToken(token);
      this.aud = decoded.aud;
      this.merchantId = decoded.merchantId;
    }
    return this.merchantId;
  }
  */
  getAllUsers() {
    const data = {
      appId: environment.appid
    };
    return this.apiServ.postPrivate('members/getAll',data);
  }

  find(data) {
    return this.apiServ.postPrivate('members/find',data);
  }

  getUser(id: string) {
    return this.apiServ.getPrivate('members/' + id);
  }
  
  getCampaignReferral(id: string) {
    return this.apiServ.getPrivate('campaign-referral/' + id);
  }
  
  addParentReferral(body: any) {
    return this.apiServ.postPrivate('campaign-referral/create', body);
  }

  update(body: any) {
    return this.apiServ.postPrivate('members/FindOneAndUpdate', body);
  }

  updateSelf(body: any) {
    return this.apiServ.postPrivate('members/updateSelf', body);
  }

  
  getToken() {
      return this.storageServ.getToken();

  }


}