import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class SmallBannerService {
  constructor(private http: HttpService) { }

  create(data) {
    return this.http.post('small-banners/Create', data);
  }

  update(id: string, data) {
    return this.http.post('small-banners/Update/' + id, data);
  }

  getBanners() {
    return this.http.get('small-banners', false);
  }

  getAdminBanners() {
    return this.http.get('small-banners/admin', false);
  }

  getMerchantBanners(walletAddress: string) {
    return this.http.get('small-banners/merchant/' + walletAddress, false);
  }

  getBanner(id: string) {
    return this.http.get('small-banners/' + id, false);
  }

  deleteBanner(data: any) {
    return this.http.post('small-banners/Delete', data);
  }
}