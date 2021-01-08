import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class IddockService {
  constructor(private http: HttpService) { }
  saveId(data: any) {
    const url = 'iddock/Create/id' ;  
    return this.http.post(url, data, false);    
  }

}