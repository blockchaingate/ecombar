import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class OrderService {

  constructor(private http: HttpService) { }

  create2(data) {
    return this.http.post('orders/create2', data, false);
  }

  update2(orderID: string, data) {
    return this.http.post('orders/update2/' + orderID, data, false);
  }

  requestRefund(id, data) {
    return this.http.post('orders/' + id + '/requestRefund',  data, false);
  }

  updateShipping(orderID: string, data) {
    return this.http.post('orders/updateShipping/' + orderID, data, false);
  }

  get(orderID: string) {
    return this.http.get('orders/public/' + orderID, false);
  }

  getRefund(orderID: string) {
    return this.http.get('orders/' + orderID + '/7starpay/refund', false);
  }
  
  get7StarPay(orderID: string, currency: string, walletAddress: string) {
    const data = {
      address: walletAddress,
      currency
    };
    return this.http.post('orders/' + orderID + '/7starpay', data, false);
  }

  updatePayment(order_id: string, paymentData: any) {
    const url = 'orders/' + order_id + '/payment';
    return this.http.post(url, paymentData);  
  }

  getMyOrders(address: string) {
    return this.http.get('orders/ownedBy/' + address, false);
  }

  getMyProducts(address: string) {
    return this.http.get('orders/my-products/' + address, false);
  }

  getAllOrders() {
    return this.http.get('orders/all', false);
  }

  gerMerchantOrders(address: string) {
    return this.http.get('orders/merchant-orders/' + address, false);
  }

  delete(orderID: string) {
    const data = {
      active: false
    }
    return this.http.post('orders/update/' + orderID, data, true);
  }
}
