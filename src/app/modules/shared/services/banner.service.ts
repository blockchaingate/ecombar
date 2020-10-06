import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private apiServ: ApiService) {
  }
  
  create(data) {    
    return this.apiServ.postPrivate('banners/Create', data);
  }

  update(id:string, data) {
    return this.apiServ.postPrivate('banners/Update/' + id, data);
  }

  getBanners() {
    return this.apiServ.getPublic('banners');
  }

  getAdminBanners() {
    return this.apiServ.getPublic('banners/admin');
  }

  getMerchantBanners(merchantId: string) {
    return this.apiServ.getPublic('banners/merchant/' + merchantId);
  }

  getBanner(id: string) {
    return this.apiServ.getPublic('banners/' + id);
  }

  deleteBanner(id) {
    return this.apiServ.getPrivate('banners/Delete/' + id);
  }  
}