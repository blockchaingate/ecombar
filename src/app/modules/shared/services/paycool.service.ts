import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const baseUrl = environment.endpoints.paycool;
@Injectable()
export class PaycoolService {
    
    constructor(private http: HttpClient) { }

    isValidMember(address: string) {
        const url = baseUrl + 'userreferral/isValid/' + address;
        return this.http.get(url);
   }
}