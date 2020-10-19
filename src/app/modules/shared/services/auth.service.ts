// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _appId: string;
    private _token: any;

    constructor(private storage: StorageMap) {
        if (!this._appId) {
            this.storage.get('_appId').subscribe(ret => { this._token = ret });
        }
        if (!this._token) {
            this.storage.get('_token').subscribe(ret => { this._token = ret });
        }
    }

    set appId(appID: string) {
        this._appId = appID;
        this.storage.set('_appId', appID).subscribe(ret => { });
    }

    get appId() {
        return this._appId;
    }

    set token(newToken: string) {
        this._token = newToken;
        this.storage.set('_token', newToken).subscribe(ret => { });
    }

    get token() {
        return this._token;
    }

    public isAuthenticated(): Observable<boolean> {
        const isAuth = new Observable<boolean>(observer => {
            const decoded = this.decodeToken(this._token);
            const exp = decoded.exp;
            const current = Math.floor(Date.now() / 1000);

            console.log('exp==', exp);
            console.log('current==', current);
            if (exp < current) {
                observer.next(false);
                observer.complete();
            }
            observer.next(true);
            observer.complete();

        });

        return isAuth;
        /*
        return this.storageServ.getToken().subscribe(token => {
            if(!token) {
                return false;
            }
            const decoded = this.decodeToken(token);
            const exp = decoded.exp;
            const current = Math.floor(Date.now() / 1000);
        
            if(exp < current) {
                return false;
            }
            return true;
          });    
        */
        /*
        // Check whether the token is expired and return
        // true or false
        if(!token) {
            return false;
        }
        const decoded = this.decodeToken(token);
        const exp = decoded.exp;
        const current = Math.floor(Date.now() / 1000);
    
        if(exp < current) {
            return false;
        }
        return true;
        */
    }

    b64DecodeUnicode(str: string) {
        return decodeURIComponent(Array.prototype.map
            .call(this.b64decode(str), function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(''));
    }

    b64decode(str: string) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var output = '';
        str = String(str).replace(/=+$/, '');
        if (str.length % 4 === 1) {
            throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }
        for (
            // initialize result and counters
            var bc = 0, bs = void 0, buffer = void 0, idx = 0;
            // get next character
            (buffer = str.charAt(idx++));
            // character found in table? initialize bit storage and add its ascii value;
            ~buffer &&
                ((bs = bc % 4 ? bs * 64 + buffer : buffer),
                    // and if not first of each 4 characters,
                    // convert the first 8 bits to one ascii character
                    bc++ % 4)
                ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
                : 0) {
            // try to find character in table (0-63, not found => -1)
            buffer = chars.indexOf(buffer);
        }
        return output;
    }

    urlBase64Decode(str: string) {
        var output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw 'Illegal base64url string!';
            }
        }
        return this.b64DecodeUnicode(output);
    }

    decodeToken(token: string) {
        if (token == null || token === '') {
            return null;
        }
        var parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('The inspected token doesn\'t appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.');
        }
        var decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token.');
        }
        return JSON.parse(decoded);
    };
}