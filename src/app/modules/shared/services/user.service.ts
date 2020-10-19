import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _id: string;
  private _displayName: string;
  private _email: string;
  private _tokenExp: Date;
  private _isSystemAdmin = false;
  private _user: User;

  constructor(private http: HttpService, private authServ: AuthService, private storage: StorageMap) {
    if (!this._id) {
      this.storage.get('_userId').subscribe((ret: string) => {
        this._id = ret;
        if (this._id && !this._user) {
          this.getUser(this._id).subscribe((ret: User) => { this._user = ret; })
        }
      });
    }
  }

  set id(newId: string) {
    this._id = newId;
    this.storage.set('_userId', newId).subscribe(ret => { });
  }

  get id() {
    return this._id;
  }

  set displayName(dispName: string) {
    this._displayName = dispName;
  }

  get displayName() {
    return this._displayName;
  }

  set email(emal: string) {
    this._email = emal;
  }

  get email() {
    return this._email;
  }

  set token(newToken: any) {
    this.authServ.token = newToken;
  }

  get token() {
    return this.authServ.token;
  }

  set tokenExp(exp: Date) {
    this._tokenExp = exp;
  }

  get tokenExp() {
    return this._tokenExp;
  }

  set isSystemAdmin(sysAdmin: boolean) {
    this._isSystemAdmin = sysAdmin;
  }

  get isSystemAdmin() {
    return this._isSystemAdmin;
  }

  set user(user: User) {
    this._user = user;
    this.storage.set('_user', user).subscribe(ret => {
      if (!this._id) {
        this._id = user._id;
      }
    });
  }

  get user() {
    return this._user;
  }

  signin(email: string, password: string) {
    const theBody = { email: email, password: password };
    return this.http.post('members/login', theBody, false);
  }

  signup(email: string, password: string) {
    const theBody = { email: email, password: password };
    return this.http.post('members/create', theBody, false);
  }

  logout() {
    this._id = '';
    this._displayName = '';
    this._email = '';
    this.authServ.token = null;
    this._tokenExp = null;
    this._isSystemAdmin = false;
    this._user = null;
    this.storage.delete('_userId').subscribe(ret => { });
    this.storage.delete('_token').subscribe(ret => { });
  }

  // Use memberId in token to get member information.
  getMe() {
    return this.http.get('members/me');
  }

  activateUser(userId: string, activationCode: string) {
    return this.http.get('members/' + 'activation/' + userId + '/' + activationCode, false);
  }

  getAllUsers() {
    return this.http.post('members/getAll', null);
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