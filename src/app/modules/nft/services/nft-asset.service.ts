import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NftAssetService {

  constructor(private http: HttpClient) { }

  create(data: any) {
    const url = environment.endpoints.blockchaingate + 'nft-asset/create';
    return this.http.post(url, data);
  }

  getBySlug(slug: string) {
    const url = environment.endpoints.blockchaingate + 'nft-asset/slug/' + slug;
    return this.http.get(url);    
  }
}
