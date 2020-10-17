import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class AddressService {

  constructor(private http: HttpService) {
  }

  getAddress(id: string) {
    return this.http.get('addresses/' + id);
  }

  addAddress(address: any) {
    return this.http.post('addresses/Create', address);
  }

  updateAddress(id: string, address: any) {
    return this.http.post('addresses/Update/' + id, address);
  }
}