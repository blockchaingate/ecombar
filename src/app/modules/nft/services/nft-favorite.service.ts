import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NftFavoriteService {
    constructor(private http: HttpClient) { }

    add(data: any) {
        const url = environment.endpoints.blockchaingate + 'nft-favorite/add';
        return this.http.post(url, data);
    }

    remove(data: any) {
        const url = environment.endpoints.blockchaingate + 'nft-favorite/remove';
        return this.http.post(url, data);
    }  

    getByAddress(address: string) {
        const url = environment.endpoints.blockchaingate + 'nft-asset/favoritedBy/' + address;
        return this.http.get(url);    
    }    
}