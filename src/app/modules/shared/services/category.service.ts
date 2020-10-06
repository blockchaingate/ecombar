import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  token: string;

  constructor(private apiServ: ApiService) {
  }
  
  create(data) {    
    return this.apiServ.postPrivate('product-categories/Create', data);
  }

  update(id:string, data) {
    return this.apiServ.postPrivate('product-categories/Update/' + id, data);
  }

  getCategories() {
    return this.apiServ.getPublic('product-categories');
  }

  getAdminCategories() {
    return this.apiServ.getPublic('product-categories/admin');
  }

  getMerchantCategories(merchantId: string) {
    return this.apiServ.getPublic('product-categories/merchant/' + merchantId);
  }

  getCategory(id: string) {
    return this.apiServ.getPublic('product-categories/' + id);
  }

  deleteCategory(id) {
    return this.apiServ.getPrivate('product-categories/Delete/' + id);
  }  
}