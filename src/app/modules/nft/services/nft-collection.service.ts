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

}
