import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { User } from '../models/user';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpService, private authServ: AuthService, private storage: StorageService) {}

  get id() {
    return this.storage.user._id;
  }

  get displayName() {
    return this.storage.user.displayName;
  }

  get email() {
    return this.storage.user.email;
  }

  set token(token: string) {
    this.storage.token = token;
  }

  get token() {
    return this.storage.token;
  }

  set tokenExp(exp: Date) {
    this.storage.tokenExp = exp;
  }

  get tokenExp(): Date {
    return this.storage.tokenExp;
  }

  set isSystemAdmin(sysAdmin: boolean) {
    this.storage.isSystemAdmin = sysAdmin;
  }

  get isSystemAdmin(): boolean {
    return this.storage.isSystemAdmin;
  }

  set user(user: User) {
    this.storage.user = user;
  }

  get user(): User {
    return this.storage.user;
  }

  signin(email: string, password: string) {
    const appId = environment['appid'];
    console.log('appId=', appId);
    const theBody = { appId, email, password };
    console.log('theBody=', theBody);
    return this.http.post('members/login', theBody, false);
  }

  signup(email: string, password: string) {
    const appId = environment['appid'];
    const theBody = { appId, email, password };
    return this.http.post('members/create', theBody, false);
  }

  logout() {
    this.storage.deleteAppId();
    this.storage.deleteUser();
    this.storage.deleteToken();
  }

  // Use memberId in token to get member information.
  getMe() {
    return this.http.get('members/me');
  }

  activateUser(userId: string, activationCode: string) {
    return this.http.get('members/' + 'activation/' + userId + '/' + activationCode, false);
  }

  getAllUsers() {
    const data = {
      appId: environment['appid']
    }
    return this.http.post('members/getAll', data);
  }

  find(data: any) {
    return this.http.post('members/find', data);
  }

  getUser(id: string) {
    return this.http.get('members/' + id);
  }

  getCampaignReferral(id: string) {
    return this.http.get('campaign-referral/' + id);
  }

  addParentReferral(data: any) {
    return this.http.post('campaign-referral/create', data);
  }

  update(data: any) {
    return this.http.post('members/FindOneAndUpdate', data);
  }

  updateSelf(data: any) {
    return this.http.post('members/updateSelf', data);
  }

  updateSelfMerchant(data: any) {
    return this.http.post('members/updateSelfMerchant', data);
  }
}