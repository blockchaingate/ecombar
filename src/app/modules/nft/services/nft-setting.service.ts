import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NftSettingService {

  constructor(private http: HttpClient) { }

  save(data: any) {
    const url = environment.endpoints.blockchaingate + 'nft-setting/save';
    return this.http.post(url, data);
  }  
  
}