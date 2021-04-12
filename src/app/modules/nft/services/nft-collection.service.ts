import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NftCollectionService {

  constructor(private http: HttpClient) { }

  create(data: any) {
    const url = environment.endpoints.blockchaingate + 'nft-collection/create';
    return this.http.post(url, data);
  }

  getByAddress(address: string) {
    const url = environment.endpoints.blockchaingate + 'nft-collection/address/' + address;
    return this.http.get(url);    
  }

  getBySlug(slug: string) {
    const url = environment.endpoints.blockchaingate + 'nft-collection/slug/' + slug;
    return this.http.get(url);    
  }
}
