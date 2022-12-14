import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class StarService {
   constructor(private http: HttpService) { }


   createOrder(item: any) {
      const url = '7star-order/create';
      return this.http.post(url, item, false);
   }

   getOrder(id: string) {
      const url = '7star-order/' + id;
      return this.http.get(url, false);
   }

   getOrderVersion(id: string) {
      const url = '7star-charge-fund/' + id + '/version';
      return this.http.get(url, false);
   }
   getTransactionHisotryForCustomer(walletAddress: string) {
      const path = '7star-charge-fund/customer/' + walletAddress;
      const res = this.http.get(path);
      return res;  
  }

  getTransactionHisotryForMerchant(walletAddress: string) {
   const path = '7star-charge-fund/merchant/' + walletAddress;
   const res = this.http.get(path);
   return res;  
  }

   getOrdersByAddress(address: string) {
      const url = '7star-order/address/' + address;
      return this.http.get(url, false);
   }

   getOrderByAddressCampaignId(address: string, campaignId: number) {
      const url = '7star-order/address-campaign/' + address + '/' + campaignId;
      return this.http.get(url, false);
   }

   // Get many orders
   getOrdersByWalletAddress(address: string) {
      const url = '7star-order/wallet/' + address;
      return this.http.get(url, false);
   }

   checkAddress(address: string) {
      const url = '7star-ref/isValid/' + address;
      return this.http.get(url, false);
   }

   isValidMember(address: string) {
      const url = '7star-ref/isValidMember/' + address;
      return this.http.get(url, false);
   }

   getRefCustomers(address) {
      const url = '7star-ref/children/' + address;
      return this.http.get(url, false);      
   }

   getLockers(fabAddress: string) {
      const url = '7star-locker/ownedBy/' + fabAddress;
      
      return this.http.get(url, false);      
   }

   getRewardsByOrderId(orderId: string) {
      const url = '7star-locker/orderId/' + orderId;
      
      return this.http.get(url, false);      
   }

   createRef(data: any) {
      const url = '7star-ref/create';
      return this.http.post(url,data, false);
   }
   
   getTree(address: string) {
      const url = '7star-ref/tree/' + address;
      return this.http.get(url, false);
   }

   getParents(address: string) {
      const url = '7star-ref/parents/' + address;
      return this.http.get(url, false);
   }

   getAgents(address: string) {
      const url = '7star-agent/smartContractAdd/' + address;
      return this.http.get(url, false);
   }

   savePayment(address: string, txid: string) {
      const data = {
         address,
         txid
      };
      const url = '7star-ref/savePayment';
      return this.http.post(url, data, false);
   }

   isContractOwner(address: string) {
      const url = '7star-ref/isContractOwner/' + address;
      return this.http.get(url, false);      
   }
   
   getPayment(id: string) {
      const url = '7star-payment/order/' + id;
      return this.http.get(url, false);
   }

   changeOrderStatus(id: string, status: number) {
      const url = '7star-order/update';
      const body = {
         id: id,
         status: status
      }
      return this.http.post(url, body, false);
   }

   changePaymentStatus(payment_id: string, status: number) {
      const url = '7star-payment/update';
      const body = {
         id: payment_id,
         status: status
      }
      return this.http.post(url, body, false);
   }

   addPayment(orderId: string, paymentMethod: string, amount: number, txid: string) {
      const item = {
         orderId: orderId,
         amount: amount,
         paymentMethod: paymentMethod,
         transactionId: txid
      };
      const url = '7star-payment/create';
      return this.http.post(url, item, false);
   }

}

