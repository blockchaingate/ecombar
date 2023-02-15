
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const baseUrl = environment.endpoints.paycool;

@Injectable({ providedIn: 'root' })

export class StoreService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get('stores');
  }

  getStoresByAddress( address: string ) {
    const url = baseUrl + 'merchantreferral/owner/' + address + '/1000/0';
    console.log('url====', url);
    return this.http.get(url);
  }

  deleteStore(data: any) {
    return this.http.post('stores/Delete', data);
  }

  getStores() {
    const url = baseUrl + 'merchantreferral/approved/1000/0';
    return this.http.get(url);
  }

  getStoresInEcombar() {
    const url = baseUrl + 'merchantreferral/ecombar/1000/0';
    return this.http.get(url);
  }

  queryHotlist() {    // 获取“热门推荐”
    const url = baseUrl + 'merchantreferral/hot';
    return this.http.get(url);

  }

  queryNewlist() {    // 获取“最新入驻”
    const url = baseUrl + 'merchantreferral/new';
    return this.http.get(url);
  }

  getStore( id: string ) {
    const url = baseUrl + 'merchantreferral/' + id;
    return this.http.get(url);
  }

  create( data: any ) {
    return this.http.post('stores/Create', data);
  }

  update( id: string, data: any ) {
    return this.http.post('stores/Update/' + id, data);
  }
}