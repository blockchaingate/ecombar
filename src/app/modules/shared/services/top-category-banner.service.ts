import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
const baseUrl = environment.endpoints.paycool;

@Injectable({ providedIn: 'root' })
export class TopCategoryBannerService {
  constructor(private http: HttpClient) { }

  create(data) {
    return this.http.post('top-category-banners/Create', data);
  }

  update(id: string, data) {
    return this.http.post('top-category-banners/Update/' + id, data);
  }

  getBanners() {
    return this.http.get('top-category-banners');
  }

  getAdminBanners() {
    return this.http.get('top-category-banners/admin');
  }

  getMerchantBanners(merchantId: string, pageSize: number, pageNum: number) {
    return this.http.get(baseUrl + 'banner/merchant/' + merchantId + '/' + pageSize + '/' + pageNum);
  }

  getBanner(id: string) {
    return this.http.get('top-category-banners/' + id);
  }

  deleteBanner(data: any) {
    return this.http.post('top-category-banners/Delete', data);
  }
}