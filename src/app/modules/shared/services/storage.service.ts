import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class StorageService {
    private _appId: string;
    private _token: string;
    private _tokenExp: Date;
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
            this.storage.get('_user').subscribe((ret: User) => {
                this._user = ret;
            });
        }

    }

    set appId(appID: string) {
        this._appId = appID;
        this.storage.set('_appId', appID).subscribe(ret => { });
    }

    get appId(): string {
        return this._appId;
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

    get isSystemAdmin(): boolean {
        return this._isSystemAdmin;
    }

}
