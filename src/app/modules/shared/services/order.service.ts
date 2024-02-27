import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
const baseUrl = environment.endpoints.paycool;

@Injectable({ providedIn: 'root' })
export class OrderService {

  constructor(private http: HttpClient) { }

  create2(data) {
    return this.http.post(baseUrl + 'userpay/createOrder', data);
  }

  update2(orderID: string, data) {
    return this.http.put(baseUrl + 'userpay/order/' + orderID, data);
  }

  getPaycoolRewardInfo(id: string, address: string, payType: string) {
    const url = baseUrl + 'userpay/order/' + id + '/' + address + '/rewardInfo/' + payType;
    return this.http.get(url);
  }

  requestRefund(id, data) {
    return this.http.post('orders/' + id + '/requestRefund',  data);
  }

  updateShipping(orderID: string, data) {
    return this.http.post('orders/updateShipping/' + orderID, data);
  }

  get( orderID: string ) {
    // 后端 router.get("/order/:id", UserPayController.getOrder);
    return this.http.get(baseUrl + 'userpay/order/' + orderID);
  }

  getRefund(orderID: string) {
    return this.http.get('order/' + orderID + '/7starpay/refund');
  }
  
  cancelrequestRefundV2(data: any) {
    return this.http.post('orders/cancelrequestRefundV2', data);
  }

  get7StarPay(orderID: string,  walletAddress: string) {
    const data = {
      address: walletAddress
    };
    return this.http.post('orders/' + orderID + '/7starpay', data);
  }

  updatePayment(order_id: string, paymentData: any) {
    const url = 'orders/' + order_id + '/payment';
    return this.http.post(url, paymentData);  
  }

  getMyOrders(address: string) {
    // 后端 router.get("/orders/user/:id/:pageSize/:pageNum", UserPayController.getOrdersByUser);
    return this.http.get(baseUrl + 'userpay/orders/user/' + address + '/100/0');
  }

  getMyProducts(address: string) {
    return this.http.get('orders/my-products/' + address);
  }

  getAllOrders() {
    return this.http.get('orders/all');
  }

  // gerMerchantOrders(address: string) {
  gerMerchantOrders(walletAddress: string) {
    // return this.http.get('orders/merchant-orders/' + address);
    const url = environment.endpoints.paycool + 'userpay/orders/merchant/' + walletAddress + '/' + 100 + '/' + 0;
    return this.http.get(url);
  }

  delete(orderID: string) {
    const data = {
      active: false
    }
    return this.http.post('orders/update/' + orderID, data);
  }
}
