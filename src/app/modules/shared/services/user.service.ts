import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  token: string;
  aud: string;
  merchantId: string;
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

  getAud() {
    if(!this.aud) {
      const token = this.getToken();
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

  getToken() {
    if(!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  b64DecodeUnicode(str: string) {
    return decodeURIComponent(Array.prototype.map
        .call(this.b64decode(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    })
        .join(''));
  }

  b64decode (str: string) {
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

  urlBase64Decode (str: string) {
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