import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class ShipService {

  constructor(private http: HttpService) { }

  createShip(data: any) {
    return this.http.post('ship/create', data, false);
  }

  getSellerShips() {
    return this.http.get('ship/role/seller',  false);
  }

  getDeliveryShips() {
    return this.http.get('ship/role/delivery',  false);
  }  

  getCustomerShips() {
    return this.http.get('ship/role/customer',  false);
  }  

  getAdminShips() {
    return this.http.get('ship/role/admin',  false);
  }  

  getMerchantShips(walletAddress: string) {
    return this.http.get('ship/merchant/' + walletAddress,  false);
  }

  addDetail(ship_id: string, data) {
    return this.http.post('ship/' + ship_id + '/detail', data, false);
  }
}