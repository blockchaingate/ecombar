import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const baseUrl = environment.endpoints.paycool;

@Injectable({ providedIn: 'root' })
export class BrandService {
  constructor(private http: HttpClient) { }

  create(data) {
    return this.http.post(baseUrl + 'brand', data);
  }

  update(id: string, data) {
    return this.http.put(baseUrl + 'brand/' + id, data);
  }

  getBrands() {
    return this.http.get('brands');
  }

  getAdminBrands() {
    return this.http.get('brands/admin');
  }

  getMerchantBrands(walletAddress: string, pageSize, pageNum) {
    return this.http.get(baseUrl + 'brand/owner/' + walletAddress + '/' + pageSize + '/' + pageNum);
  }

  getBrand(id: string) {
    return this.http.get(baseUrl + 'brand/' + id);
  }

  deleteBrand(data: any) {
    return this.http.post('brands/Delete', data);
  }
}