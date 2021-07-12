import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class BrandService {
  constructor(private http: HttpService) { }

  create(data) {
    return this.http.post('brands/Create', data);
  }

  update(id: string, data) {
    return this.http.put('brands/Update/' + id, data);
  }

  getBrands() {
    return this.http.get('brands', false);
  }

  getAdminBrands() {
    return this.http.get('brands/admin', false);
  }

  getMerchantBrands(walletAddress: string) {
    return this.http.get('brands/merchant/' + walletAddress, false);
  }

  getBrand(id: string) {
    return this.http.get('brands/' + id, false);
  }

  deleteBrand(id: string) {
    return this.http.get('brands/Delete/' + id);
  }
}