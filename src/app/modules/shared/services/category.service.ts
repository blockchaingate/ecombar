import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  token: string;

  constructor(private http: HttpService) { }

  create(data) {
    return this.http.post('product-categories/Create', data);
  }

  update(id: string, data) {
    return this.http.post('product-categories/Update/' + id, data);
  }

  getCategories() {
    return this.http.get('product-categories', false);
  }

  getAdminCategories() {
    return this.http.get('product-categories/admin', false);
  }

  getMerchantCategories(merchantId: string) {
    return this.http.get('product-categories/merchant/' + merchantId, false);
  }

  getCategory(id: string) {
    return this.http.get('product-categories/' + id, false);
  }

  deleteCategory(id: string) {
    return this.http.delete('product-categories/delete/' + id);
  }
}