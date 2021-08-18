import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class TopCategoryBannerService {
  constructor(private http: HttpService) { }

  create(data) {
    return this.http.post('top-category-banners/Create', data);
  }

  update(id: string, data) {
    return this.http.post('top-category-banners/Update/' + id, data);
  }

  getBanners() {
    return this.http.get('top-category-banners', false);
  }

  getAdminBanners() {
    return this.http.get('top-category-banners/admin', false);
  }

  getMerchantBanners(walletAddress: string) {
    return this.http.get('top-category-banners/merchant/' + walletAddress, false);
  }

  getBanner(id: string) {
    return this.http.get('top-category-banners/' + id, false);
  }

  deleteBanner(data: any) {
    return this.http.post('top-category-banners/Delete', data);
  }
}