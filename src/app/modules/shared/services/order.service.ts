import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class OrderService {

  constructor(private http: HttpService) { }

  create(data) {
    return this.http.post('orders/create', data, true);
  }

  update(orderID: string, data) {
    return this.http.post('orders/update/' + orderID, data, true);
  }

  get(orderID: string) {
    return this.http.get('orders/' + orderID, true);
  }
}
