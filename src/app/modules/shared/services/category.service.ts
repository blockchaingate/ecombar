import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const baseUrl = environment.endpoints.paycool;

@Injectable({ providedIn: 'root' })
export class CategoryService {
  token: string;

  constructor(private http: HttpClient) { }

  create(data) {
    return this.http.post(baseUrl + 'category', data);
  }

  update(id: string, data) {
    return this.http.put(baseUrl + 'category/' + id, data);
  }

  getCategories() {
    return this.http.get('product-categories');
  }

  getAdminCategories() {
    return this.http.get('product-categories/admin');
  }

  getAdminCategoriesWithCount() {
    return this.http.get('product-categories/admin_with_counts');
  }
  

  getMerchantCategories(walletAddress: string, pageSize:number, pageNum:number) {
    return this.http.get(baseUrl + 'category/owner/' + walletAddress + '/' + pageSize + '/' + pageNum);
  }

  getCategory(id: string) {
    return this.http.get(baseUrl + 'category/' + id);
  }

  deleteCategory(data: any) {
    return this.http.post('product-categories/Delete', data);
  }
}