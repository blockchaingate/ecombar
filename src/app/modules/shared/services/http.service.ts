import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class HttpService {
    constructor(private http: HttpClient, private authServ: AuthService) { }

    get(path: string, jwtAuth = true) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-app-id': this.authServ.appId
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.authServ.token,
                'x-app-id': this.authServ.appId
            });
        }
        const options = {
            headers: httpHeaders
        };
        const url = environment.endpoints.blockchaingate + path;
        return this.http.get(url, options);
    }

    post(path: string, data: any, jwtAuth = true) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-app-id': this.authServ.appId
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.authServ.token,
                'x-app-id': this.authServ.appId
            });
        }
        const options = {
            headers: httpHeaders
        };
        data.appId = this.authServ.appId;
        const url = environment.endpoints.blockchaingate + path;
        return this.http.post(url, data, options);
    }

    put(path: string, data: any, jwtAuth = true) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-app-id': this.authServ.appId
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.authServ.token,
                'x-app-id': this.authServ.appId
            });
        }
        const options = {
            headers: httpHeaders
        };
        data.appId = this.authServ.appId;
        const url = environment.endpoints.blockchaingate + path;
        return this.http.put(url, data, options);
    }

    delete(path: string, jwtAuth = true) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-app-id': this.authServ.appId
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.authServ.token,
                'x-app-id': this.authServ.appId
            });
        }
        const options = {
            headers: httpHeaders
        };
        const url = environment.endpoints.blockchaingate + path;
        return this.http.delete(url, options);
    }

    getPrivate(path: string, token: string) {
        if (!token) {
            token = this.authServ.token;
        }

        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-access-token': token,
            'x-app-id': this.authServ.appId
        });
        const options = {
            headers: httpHeaders
        };
        const url = environment.endpoints.blockchaingate + path;
        return this.http.get(url, options);
    }

    postPrivate(path: string, data: any, token: string) {
        if (!token) {
            token = this.authServ.token;
        }

        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-access-token': token,
            'x-app-id': this.authServ.appId
        });
        const options = {
            headers: httpHeaders
        };
        data.appId = this.authServ.appId;
        const url = environment.endpoints.blockchaingate + path;
        return this.http.post(url, data, options);
    }

    getRaw(path: string) {
        const url = environment.endpoints.blockchaingate + path;
        return this.http.get(url);
    }
}
