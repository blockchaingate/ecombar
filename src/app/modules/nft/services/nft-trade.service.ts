import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NftTradeService {

  constructor(private http: HttpClient) { }

  create(data: any) {
    const url = environment.endpoints.blockchaingate + 'nft-trade/create';
    return this.http.post(url, data);
  }

  getBySmartContract(smartContractAddress: string) {
    const url = environment.endpoints.blockchaingate + 'nft-trade/smartContractAddress/' + smartContractAddress;
    return this.http.get(url);    
  }

  getBySmartContractTokenId(smartContractAddress: string, tokenId: string) {
    const url = environment.endpoints.blockchaingate + 'nft-trade/smartContractAddressTokenId/' 
    + smartContractAddress + '/' + tokenId;
    return this.http.get(url);      
  }
}
