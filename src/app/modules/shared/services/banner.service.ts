import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class BannerService {
  constructor(private http: HttpService) { }

  create(data) {
    return this.http.post('banners/Create', data);
  }

  update(id: string, data) {
    return this.http.post('banners/Update/' + id, data);
  }

  getBanners() {
    return this.http.get('banners', false);
  }

  getAdminBanners() {
    return this.http.get('banners/admin', false);
  }

  getMerchantBanners(walletAddress: string) {
    return this.http.get('banners/merchant/' + walletAddress, false);
  }

  getBanner(id: string) {
    return this.http.get('banners/' + id, false);
  }

  deleteBanner(data: any) {
    return this.http.post('banners/Delete', data);
  }
}