import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class ShipService {

  constructor(private http: HttpService) { }

  createShip(data: any) {
    return this.http.post('ship/create', data, true);
  }

  getSellerShips() {
    return this.http.get('ship/role/seller',  true);
  }

  getDeliveryShips() {
    return this.http.get('ship/role/delivery',  true);
  }  

  getCustomerShips() {
    return this.http.get('ship/role/customer',  true);
  }  

  getAdminShips() {
    return this.http.get('ship/role/admin',  true);
  }  

  addDetail(ship_id: string, data) {
    return this.http.post('ship/' + ship_id + '/detail', data, true);
  }
}