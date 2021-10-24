import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class AddressService {

  constructor(private http: HttpService) {
  }

  getAddress(id: string) {
    return this.http.get('addresses/' + id, false);
  }

  addAddress(address: any) {
    return this.http.post('addresses/Create2', address, false);
  }

  updateAddress(id: string, address: any) {
    return this.http.post('addresses/Update2/' + id, address, false);
  }

  getAddresses(walletAddress: string) {
    return this.http.get('addresses/owner/' + walletAddress, false);
  }
}