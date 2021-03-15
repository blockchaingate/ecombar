import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class ShipService {

  constructor(private http: HttpService) { }

  createShip(data: any) {
    return this.http.post('ship/create', data, true);
  }
}