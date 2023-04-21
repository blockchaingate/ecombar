
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'accept': 'application/json'
    })
};

const httpOptionsJson = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
    })
};

const baseUrl = environment.endpoints['paycool'];
const madeatUrl = environment.endpoints['madeat'];

@Injectable({ providedIn: 'root' })
export class ShippingCarrierService {

    constructor(
        private http: HttpClient,
        private http2: HttpService) { 
    }

    // 原有 /table/create
    create( data ) {
        return this.http2.post('shipping-carrier/Create', data);
    }
    // 现用 /table/create
    createTable( data ) {
        return this.http.put(madeatUrl + 'table/create', JSON.stringify(data), httpOptionsJson);
    }

    // 原有 /table/update
    update( id: string, data ) {
        return this.http2.post('shipping-carrier/Update/' + id, data);
    }
    // 现用 /table/update
    updateTable( data ) {
        return this.http.put(madeatUrl + 'table/update', JSON.stringify(data), httpOptionsJson);
    }

    getShippingCarriers() {
        return this.http2.get('shipping-carrier', false);
    }

    // 原有 /table/list
    getMerchantShippingCarriers( walletAddress: string ) {
        return this.http2.get('shipping-carrier/merchant/' + walletAddress, false);
    }
    // 现用 /table/list
    getTableList() {    // 东西不多，不用 skip/limit
        return this.http.get(madeatUrl + 'table/list', httpOptions);
    }

    // 原有 /table/info
    getShippingCarrier(id: string) {
        return this.http2.get('shipping-carrier/' + id, false);
    }
    // 现用 /table/info
    getTableInfo( id: string ) {
        return this.http.get(madeatUrl + `table/info?number=${id}`, httpOptions);
    }

    // 原有 /table/delete
    deleteShippingCarrier(data: any) {
        return this.http2.post('shipping-carrier/Delete', data);
    }
    // 现用 /table/delete
    deleteTable( id: number ) {
        return this.http.post(madeatUrl + `table/delete?number=${id}`, httpOptions);
    }
}
