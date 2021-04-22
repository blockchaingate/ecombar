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

  getBySmartContract(smartContractAddress: string) {
    const url = environment.endpoints.blockchaingate + 'nft-order/smartContractAddress/' + smartContractAddress;
    return this.http.get(url);    
  }

  getBySmartContractTokenId(smartContractAddress: string, tokenId: string) {
    const url = environment.endpoints.blockchaingate + 'nft-order/smartContractAddressTokenId/' 
    + smartContractAddress + '/' + tokenId;
    return this.http.get(url);      
  }
}
