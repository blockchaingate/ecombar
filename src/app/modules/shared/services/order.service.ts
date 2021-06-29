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

  updateShipping(orderID: string, data) {
    return this.http.post('orders/updateShipping/' + orderID, data, true);
  }

  get(orderID: string) {
    return this.http.get('orders/' + orderID, true);
  }

  updatePayment(order_id: string, paymentData: any) {
    const url = 'orders/' + order_id + '/payment';
    return this.http.post(url, paymentData);  
  }

  getMyOrders() {
    return this.http.get('orders', true);
  }

  getMyProducts() {
    return this.http.get('orders/my-products', true);
  }

  getAllOrders() {
    return this.http.get('orders/all', true);
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
