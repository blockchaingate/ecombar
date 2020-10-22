import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';

interface OPTIONS {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    // responseType: "arraybuffer";
    withCredentials?: boolean;
}

@Injectable({ providedIn: 'root' })
export class HttpService {
    constructor(private http: HttpClient, private storage: StorageService) { }

    get(path: string, jwtAuth = true): Observable<any> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.storage.token
            });
        }
        const options: OPTIONS = {
            headers: httpHeaders
        };
        const url = environment.endpoints.blockchaingate + path;
        return this.http.get(url, options);
    }

    post(path: string, data: any, jwtAuth = true): Observable<any> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.storage.token
            });
        }
        const options: OPTIONS = {
            headers: httpHeaders
        };
        data.appId = environment.appid;
        const url = environment.endpoints.blockchaingate + path;
        return this.http.post(url, data, options);
    }

    put(path: string, data: any, jwtAuth = true): Observable<any> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.storage.token
            });
        }
        const options: OPTIONS = {
            headers: httpHeaders
        };
        data.appId = this.storage.appId;
        const url = environment.endpoints.blockchaingate + path;
        return this.http.put(url, data, options);
    }

    delete(path: string, jwtAuth = true): Observable<any> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.storage.token
            });
        }
        const options: OPTIONS = {
            headers: httpHeaders
        };
        const url = environment.endpoints.blockchaingate + path;
        return this.http.delete(url, options);
    }

    getPrivate(path: string, token: string): Observable<any> {
        if (!token) {
            token = this.storage.token;
        }

        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-access-token': token
        });
        const options: OPTIONS = {
            headers: httpHeaders
        };
        const url = environment.endpoints.blockchaingate + path;
        return this.http.get(url, options);
    }

    postPrivate(path: string, data: any, token: string): Observable<any> {
        if (!token) {
            token = this.storage.token;
        }

        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-access-token': token
        });
        const options: OPTIONS = {
            headers: httpHeaders
        };
        data.appId = this.storage.appId;
        const url = environment.endpoints.blockchaingate + path;
        return this.http.post(url, data, options);
    }

    // fullUrl: http://...  or https://...
    getRaw(fullUrl: string): Observable<any> {
        return this.http.get(fullUrl);
    }

    // fullUrl: http://...  or https://...
    postRaw(fullUrl: string, data: any, options: OPTIONS): Observable<any> {
        return this.http.post(fullUrl, data, options);
    }

    uploadFile(url: string, contenType: string, file: File) {
        contenType = contenType.replace('+', '/');
        contenType = 'application/octet-stream';
        const httpHeaders = new HttpHeaders({ 'Content-Type': contenType, 'x-amz-acl': 'public-read' });
        const options: OPTIONS = {
            headers: httpHeaders,
            reportProgress: true
        };
        return this.http.put(url, file, options);
    }
}
