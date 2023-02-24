
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

  getStoresInEcombar() {    // 获取“商家列表”
    // 后端 router.get("/ecombar/:pageSize/:pageNum", MerchantReferralController.getAllEcombarReferrals);
    // 后端使用 Mongoose 连接 MongoDB，定义模式和模型（models 目录），进行查询。
    // 条件 .find({ address, status: 2, hideOnStore: false })
    const url = baseUrl + 'merchantreferral/ecombar/1000/0';    // 1000/0 一次取完，前端应改为逐页读
    return this.http.get(url);
  }

  queryHotlist() {    // 获取“热门推荐”
    // 后端 router.get("/hot", MerchantReferralController.getHotReferrals);
    const url = baseUrl + 'merchantreferral/hot';  // 后端未完成
    return this.http.get(url);
  }

  queryNewlist() {    // 获取“最新入驻”
    // 后端 router.get("/new", MerchantReferralController.getNewReferrals);
    const url = baseUrl + 'merchantreferral/new';  // 后端未完成
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