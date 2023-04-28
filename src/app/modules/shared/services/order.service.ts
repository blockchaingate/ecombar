
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'accept': 'application/json'
    })
};

const httpOptionsJson = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
    })
};

const baseUrl = environment.endpoints['paycool'];  // 未来取消
// const madeatUrl = environment.endpoints['madeat'];  // 随时会改

@Injectable({ providedIn: 'root' })
export class OrderService {

    constructor(private http: HttpClient) { }

    // 原有 /order/create
    create2( data ) {
        return this.http.post(baseUrl + 'userpay/createOrder', data);
    }
    // 现用 /order/create
    createOrder( data ) {
        const madeatUrl = environment.endpoints['madeat'];
        return this.http.put(madeatUrl + 'order/create', JSON.stringify(data), httpOptionsJson);
    }

    // 原有 /order/update
    update2( orderID: string, data ) {
        return this.http.put(baseUrl + 'userpay/order/' + orderID, data);
    }
    // 现用 /order/update
    updateOrder( data ) {
        const madeatUrl = environment.endpoints['madeat'];
        return this.http.put(madeatUrl + 'order/update', JSON.stringify(data), httpOptionsJson);
    }

    update_items(externalOrderNumber: string, data) {  // Order 更新 items
        // put https://test.fabcoin.org/api/userpay/order/externalOrderNumber/123456
        // 将 {"items":[{...}, ...]} 更新到指定的 externalOrderNumber
        return this.http.put(baseUrl + 'userpay/order/externalOrderNumber/' + externalOrderNumber, data);
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

    // 原有 /order/info
    get( orderID: string ) {
        // 后端 router.get("/order/:id", UserPayController.getOrder);
        return this.http.get(baseUrl + 'userpay/order/' + orderID);
    }
    // 现用 /order/info
    getOrderInfo( id: string ) {
        const madeatUrl = environment.endpoints['madeat'];
        return this.http.get(madeatUrl + `order/info?id=${id}`, httpOptions);
    }

    getRefund( orderID: string ) {
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

    // 原有 /order/list
    gerMerchantOrders(walletAddress: string) {
        // return this.http.get('orders/merchant-orders/' + address);
        const url = environment.endpoints['paycool'] + 'userpay/orders/merchant/' + walletAddress + '/' + 100 + '/' + 0;
        return this.http.get(url);
    }
    // 现用 /order/list
    getOrderList() {    // 东西不多，不用 skip/limit
        const madeatUrl = environment.endpoints['madeat'];
        return this.http.get(madeatUrl + 'order/list', httpOptions);
    }
    // 现用 /order/list（带 table 参数）
    getOrderList2( table: number ) {    // 东西不多，不用 skip/limit
        const madeatUrl = environment.endpoints['madeat'];
        return this.http.get(madeatUrl + `order/list?table=${table}`, httpOptions);
    }

    delete(orderID: string) {
        const data = {
        active: false
        }
        return this.http.post('orders/update/' + orderID, data);
    }
}
