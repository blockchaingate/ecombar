import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class MainLayoutService {
  constructor(private http: HttpService) { }
  create(data) {
    return this.http.post('mainlayout/Create', data);
  }

  update(id: string, data) {
    return this.http.put('mainlayout/Update/' + id, data);
  }  

  getAdminMainLayouts() {
    return this.http.get('mainlayout/admin');
  }

  getMerchantMainLayouts(merchantId: string) {
    return this.http.get('mainlayout/merchant/' + merchantId);
  }  
 
  deleteMainLayout(id) {
    return this.http.get('mainlayout/Delete/' + id);
  }  

  getMainLayout(id: string) {
    return this.http.get('mainlayout/' + id);
  }  
}