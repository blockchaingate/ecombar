import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
    token: string;

    constructor(private storage: StorageMap) {
    }

    saveToken(token: string) {
        return this.storage.set('token', token);
    }

    removeToken() {
        return this.storage.delete('token');
    }
    getToken() {
        if(!this.token) {
            return this.storage.get('token');
        }

        const observable = new Observable(subscriber => {
            subscriber.next(this.token);
        });        
        return observable;
    }
}