import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const baseUrl = environment.endpoints.paycool;

@Injectable({ providedIn: 'root' })
export class MainLayoutService {
  constructor(private http: HttpClient) { }
  create(data) {
    return this.http.post('mainlayout/Create', data);
  }

  update(id: string, data) {
    return this.http.put('mainlayout/Update/' + id, data);
  }  

  getAdminMainLayouts() {
    return this.http.get('mainlayout/admin');
  }

  getMerchantMainLayouts(merchantId: string, pageSize: number, pageNum: number) {
    return this.http.get(baseUrl + 'mainlayout/merchant/' + merchantId + '/' + pageSize + '/' + pageNum);
  }  
 
  deleteMainLayout(data: any) {
    return this.http.post('mainlayout/Delete', data);
  }  

  getMainLayout(id: string) {
    return this.http.get('mainlayout/' + id);
  }  
}