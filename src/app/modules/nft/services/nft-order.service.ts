import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NftOrderService {

  constructor(private http: HttpClient) { }

  create(data: any) {
    const url = environment.endpoints.blockchaingate + 'nft-order/create';
    return this.http.post(url, data);
  }

  changePrice(orderId: string, data: any) {
    const url = environment.endpoints.blockchaingate + 'nft-order/' + orderId + '/change';
    return this.http.post(url, data);
  }

  cancel(orderId: string) {
    const url = environment.endpoints.blockchaingate + 'nft-order/' + orderId;
    return this.http.delete(url);    
  }

  getBySmartContract(smartContractAddress: string) {
    const url = environment.endpoints.blockchaingate + 'nft-order/smartContractAddress/' + smartContractAddress;
    return this.http.get(url);    
  }

  getOffersByAddress(address: string) {
    const url = environment.endpoints.blockchaingate + 'nft-order/offers/address/' + address;
    return this.http.get(url);  
  }

  getBySmartContractTokenId(smartContractAddress: string, tokenId: string) {
    const url = environment.endpoints.blockchaingate + 'nft-order/smartContractAddressTokenId/' 
    + smartContractAddress + '/' + tokenId;
    return this.http.get(url);      
  }

  atomicMatch(owner: string, makerOrderId: string, takerOrder: any, txhex: string, balances) {
    const data = {
      owner, makerOrderId, takerOrder, txhex, balances
    };

    const url = environment.endpoints.blockchaingate + 'nft-order/atomicMatch';
    return this.http.post(url, data);    
  }
}
