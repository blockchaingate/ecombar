import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class OrderService {

  constructor(private http: HttpService) { }

  create(data) {
    return this.http.post('orders/create', data, false);
  }

  update(orderID: string, data) {
    return this.http.post('orders/update/' + orderID, data, false);
  }

  updateShipping(orderID: string, data) {
    return this.http.post('orders/updateShipping/' + orderID, data, false);
  }

  get(orderID: string) {
    return this.http.get('orders/' + orderID, false);
  }

  updatePayment(order_id: string, paymentData: any) {
    const url = 'orders/' + order_id + '/payment';
    return this.http.post(url, paymentData);  
  }

  getMyOrders(address: string) {
    return this.http.get('orders/ownedBy/' + address, false);
  }

  getMyProducts() {
    return this.http.get('orders/my-products', false);
  }

  getAllOrders() {
    return this.http.get('orders/all', false);
  }

  gerMerchantOrders() {
    return this.http.get('orders/merchant-orders/all', true);
  }

  delete(orderID: string) {
    const data = {
      active: false
    }
    return this.http.post('orders/update/' + orderID, data, true);
  }
}
