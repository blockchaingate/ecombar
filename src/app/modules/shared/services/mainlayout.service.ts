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

  getMerchantMainLayouts(walletAddress: string) {
    return this.http.get('mainlayout/merchant/' + walletAddress);
  }  
 
  deleteMainLayout(data: any) {
    return this.http.post('mainlayout/Delete', data);
  }  

  getMainLayout(id: string) {
    return this.http.get('mainlayout/' + id);
  }  
}