import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private apiServ: ApiService) {
  }
  
  create(data) {
    return this.apiServ.postPrivate('orders/create', data);
  }

  update(orderID, data) {
    return this.apiServ.postPrivate('orders/update/' + orderID, data);
  }

  get(orderID) {
    return this.apiServ.getPrivate('orders/' + orderID);
  }
}
