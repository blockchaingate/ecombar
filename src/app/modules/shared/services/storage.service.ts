import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
    private _appId: string;
    private _token: string;
    private _tokenExp: Date;
    private _lang: string;
    private _isSystemAdmin: boolean;
    private _user: User = {};

    constructor(private storage: StorageMap) {
        if (!this._appId) {
            this.storage.get('_appId').subscribe((ret: string) => { this._appId = ret; });
        }
        if (!this._token) {
            this.storage.get('_token').subscribe((ret: string) => { this._token = ret; });
        }
        if (!this._user) {
            this.storage.get('_user').subscribe((ret: User) => { this._user = ret; });
        }
        if (!this._lang) {
            this._lang = localStorage.getItem('_lang');
        }

    }

    get(fieldName) {
        return this.storage.get(fieldName);
    }

    set appId(appID: string) {
        this._appId = appID;
        this.storage.set('_appId', appID).subscribe(ret => { });
    }

    get appId(): string {
        return this._appId;
    }

    set lang(newLang: string) {
        this._lang = newLang;
        localStorage.setItem('_lang', newLang);
    }

    get lang(): string {
        if(!this._lang) {
            this._lang = localStorage.getItem('_lang');
            if(!this._lang) {
                this._lang = 'en';
                localStorage.setItem('_lang', 'en');
            }
        }
        return this._lang;
    }

    deleteAppId(): void {
        this._appId = '';
        this.storage.delete('_appId');
    }

    set token(newToken: string) {
        this._token = newToken;
        this.storage.set('_token', newToken).subscribe(ret => { });
    }

    get token(): string {
        return this._token;
    }

    deleteToken(): void {
        this._token = '';
        this.storage.delete('_token').subscribe(ret => { });
    }

    set user(newUser: User) {
        this._user = newUser;
        this.storage.set('_user', newUser).subscribe(ret => { });
    }

    get user(): User {
        return this._user;
    }

    getUser() {
        return this.storage.get('_user');
    }
    deleteUser(): void {
        this._user = null;
        this.storage.delete('_user').subscribe(ret => { });
    }

    set tokenExp(exp: Date) {
        this._tokenExp = exp;
        this.storage.set('_tokenExp', exp).subscribe(ret => { });
    }

    get tokenExp(): Date {
        return this._tokenExp;
    }

    set isSystemAdmin(sysAdmin: boolean) {
        this._isSystemAdmin = sysAdmin;
        this.storage.set('_isSystemAdmin', sysAdmin).subscribe(ret => { });
    }

    get isSystemAdmin() {
        return this._isSystemAdmin;
    }
    checkSystemAdmin() {
        if (this._isSystemAdmin) {
            const obs = new Observable((observer) => {
                observer.next(this._isSystemAdmin);
            });
            return obs;
        }
        return this.storage.get('_isSystemAdmin');
    }

}
