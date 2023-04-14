import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class ShippingCarrierService {

  constructor(private http: HttpService) { }

  create(data) {
    return this.http.post('shipping-carrier/Create', data);
  }

  update(id: string, data) {
    return this.http.post('shipping-carrier/Update/' + id, data);
  }

  getShippingCarriers() {
    return this.http.get('shipping-carrier', false);
  }

  getMerchantShippingCarriers( walletAddress: string ) {
    return this.http.get('shipping-carrier/merchant/' + walletAddress, false);
  }

  getShippingCarrier(id: string) {
    return this.http.get('shipping-carrier/' + id, false);
  }

  deleteShippingCarrier(data: any) {
    return this.http.post('shipping-carrier/Delete', data);
  }
}