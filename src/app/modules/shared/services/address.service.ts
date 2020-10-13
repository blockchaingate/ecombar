import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private apiServ: ApiService) {
  }

  getAddress(id: string) {
    return this.apiServ.getPrivate('addresses/' + id);
  }

  addAddress(address: any) {
    return this.apiServ.postPrivate('addresses/Create', address);
  }

  updateAddress(id: string, address: any) {
    return this.apiServ.postPrivate('addresses/Update/' + id, address);
  }
}