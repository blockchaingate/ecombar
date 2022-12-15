import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const baseUrl = environment.endpoints.paycool;

@Injectable({ providedIn: 'root' })
export class AddressService {

  constructor(private http: HttpClient) {
  }

  getAddress(id: string) {
    return this.http.get(baseUrl + 'address/' + id);
  }

  addAddress(address: any) {
    return this.http.post(baseUrl + 'address', address);
  }

  updateAddress(id: string, address: any) {
    return this.http.put(baseUrl + 'address/' + id, address);
  }

  getAddresses(walletAddress: string) {
    return this.http.get(baseUrl + 'address/owner/' + walletAddress + '/100/0');
  }
}