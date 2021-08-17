import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NftCollectionService {

  constructor(private http: HttpClient) { }

  getAll() {
    const url = environment.endpoints.blockchaingate + 'nft-collection';
    return this.http.get(url);           
  }

  create(data: any) {
    const url = environment.endpoints.blockchaingate + 'nft-collection/create';
    return this.http.post(url, data);
  }

  update(id: string, data: any) {
    const url = environment.endpoints.blockchaingate + 'nft-collection/' + id + '/update';
    return this.http.post(url, data);
  }

  getByAddress(address: string) {
    const url = environment.endpoints.blockchaingate + 'nft-collection/address/' + address;
    return this.http.get(url);    
  }

  getBySmartContractAddress(address: string) {
    const url = environment.endpoints.blockchaingate + 'nft-collection/smartContractAddress/' + address;
    return this.http.get(url);    
  }

  getBySlug(slug: string) {
    const url = environment.endpoints.blockchaingate + 'nft-collection/slug/' + slug;
    return this.http.get(url);    
  }

  checkNameExist(name: string) {
    const url = environment.endpoints.blockchaingate + 'nft-collection/nameExist/' + name;
    return this.http.get(url);      
  }
}
