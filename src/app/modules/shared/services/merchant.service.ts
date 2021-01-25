import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { HttpService } from './http.service';
import { Merchant } from '../models/merchant';

@Injectable({ providedIn: 'root' })
export class MerchantService {
    private _id: string;
    private _name: string;
    private _merchant: Merchant;

    constructor(private http: HttpService, private storage: StorageMap) {
        if(!this._id) {
            storage.get('_merchantId').subscribe((ret: string) => {this._id = ret});
        }
        if(!this._merchant) {
            storage.get('_merchant').subscribe((ret: Merchant) => {this._merchant = ret});
        }
    }

    set id(newId: string) {
        this._id = newId;
        this.storage.set('_merchantId', newId).subscribe(ret =>{});
    }

    get id() {
        return this._id;
    }

    set name(nam: string) {
        this._name = nam;
    }

    get name() {
        return this._name;
    }

    getAll() {
        return this.http.get('merchants');
    }

    approve(id: string) {
        const url = 'merchants/approve/' + id ;
        return this.http.get(url);
    }

    create(data: any) {
        return this.http.post('merchants/create', data);
    }

    getMerchant(id: string) {
        return this.http.get('merchants/' + id);
    }

    find(data: any) {
        return this.http.post('merchants/find', data);
    }

    update(data: any) {
        return this.http.post('merchants/FindOneAndUpdate', data);
    }
}