import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class FeatureService {
  constructor(private http: HttpService) { }

  create(data) {
    return this.http.post('features/Create', data);
  }

  update(id: string, data) {
    return this.http.post('features/Update/' + id, data);
  }

  getFeatures() {
    return this.http.get('features', false);
  }

  getMerchantFeatures(walletAddress: string) {
    return this.http.get('features/merchant/' + walletAddress, false);
  }

  getFeature(id: string) {
    return this.http.get('features/' + id, false);
  }

  deleteFeature(data: any) {
    return this.http.post('features/Delete', data);
  }
}